const Message = require('../models/Message');
const Channel = require('../models/Channel');
const User = require('../models/User');

// Store active users
const activeUsers = new Map();

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.username} (${socket.id})`);

    // Add user to active users
    activeUsers.set(socket.userId, {
      socketId: socket.id,
      user: socket.user,
      lastSeen: new Date()
    });

    // Update user status to online
    User.findByIdAndUpdate(socket.userId, {
      status: 'online',
      lastSeen: new Date()
    }).exec();

    // Join user to their channels
    socket.on('join-channels', async () => {
      try {
        const channels = await Channel.find({
          members: socket.userId,
          isActive: true
        }).select('_id');

        channels.forEach(channel => {
          socket.join(`channel-${channel._id}`);
        });

        // Notify others that user is online
        socket.broadcast.emit('user-online', {
          userId: socket.userId,
          user: socket.user
        });
      } catch (error) {
        console.error('Error joining channels:', error);
      }
    });

    // Handle joining a specific channel
    socket.on('join-channel', (channelId) => {
      socket.join(`channel-${channelId}`);
      console.log(`User ${socket.user.username} joined channel ${channelId}`);
    });

    // Handle leaving a channel
    socket.on('leave-channel', (channelId) => {
      socket.leave(`channel-${channelId}`);
      console.log(`User ${socket.user.username} left channel ${channelId}`);
    });

    // Handle sending messages
    socket.on('send-message', async (data) => {
      try {
        const { channelId, content, type = 'text', replyTo, attachments = [] } = data;

        // Verify user is member of channel
        const channel = await Channel.findOne({
          _id: channelId,
          members: socket.userId,
          isActive: true
        });

        if (!channel) {
          socket.emit('error', { message: 'Channel not found or access denied' });
          return;
        }

        // Create message
        const message = await Message.create({
          content,
          sender: socket.userId,
          channel: channelId,
          type,
          replyTo,
          attachments
        });

        await message.populate([
          { path: 'sender', select: 'username avatar' },
          { path: 'replyTo', select: 'content sender' }
        ]);

        // Emit message to channel
        io.to(`channel-${channelId}`).emit('new-message', message);

        console.log(`Message sent in channel ${channelId} by ${socket.user.username}`);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing-start', (data) => {
      const { channelId } = data;
      socket.to(`channel-${channelId}`).emit('user-typing', {
        userId: socket.userId,
        username: socket.user.username,
        channelId
      });
    });

    socket.on('typing-stop', (data) => {
      const { channelId } = data;
      socket.to(`channel-${channelId}`).emit('user-stopped-typing', {
        userId: socket.userId,
        channelId
      });
    });

    // Handle message reactions
    socket.on('add-reaction', async (data) => {
      try {
        const { messageId, emoji } = data;

        const message = await Message.findById(messageId);
        if (!message) {
          socket.emit('error', { message: 'Message not found' });
          return;
        }

        // Check if user already reacted with this emoji
        const existingReaction = message.reactions.find(
          reaction => reaction.user.toString() === socket.userId.toString() && reaction.emoji === emoji
        );

        if (existingReaction) {
          // Remove reaction
          message.reactions = message.reactions.filter(
            reaction => !(reaction.user.toString() === socket.userId.toString() && reaction.emoji === emoji)
          );
        } else {
          // Add reaction
          message.reactions.push({
            emoji,
            user: socket.userId
          });
        }

        await message.save();
        await message.populate('reactions.user', 'username');

        // Emit updated message to channel
        io.to(`channel-${message.channel}`).emit('message-updated', message);
      } catch (error) {
        console.error('Error adding reaction:', error);
        socket.emit('error', { message: 'Failed to add reaction' });
      }
    });

    // Handle message editing
    socket.on('edit-message', async (data) => {
      try {
        const { messageId, content } = data;

        const message = await Message.findOne({
          _id: messageId,
          sender: socket.userId,
          isDeleted: false
        });

        if (!message) {
          socket.emit('error', { message: 'Message not found or access denied' });
          return;
        }

        message.content = content;
        message.edited = true;
        message.editedAt = new Date();
        await message.save();

        await message.populate([
          { path: 'sender', select: 'username avatar' },
          { path: 'replyTo', select: 'content sender' }
        ]);

        // Emit updated message to channel
        io.to(`channel-${message.channel}`).emit('message-updated', message);
      } catch (error) {
        console.error('Error editing message:', error);
        socket.emit('error', { message: 'Failed to edit message' });
      }
    });

    // Handle message deletion
    socket.on('delete-message', async (data) => {
      try {
        const { messageId } = data;

        const message = await Message.findOne({
          _id: messageId,
          sender: socket.userId,
          isDeleted: false
        });

        if (!message) {
          socket.emit('error', { message: 'Message not found or access denied' });
          return;
        }

        message.isDeleted = true;
        message.deletedAt = new Date();
        await message.save();

        // Emit message deletion to channel
        io.to(`channel-${message.channel}`).emit('message-deleted', {
          messageId: message._id,
          channelId: message.channel
        });
      } catch (error) {
        console.error('Error deleting message:', error);
        socket.emit('error', { message: 'Failed to delete message' });
      }
    });

    // Handle user status updates
    socket.on('update-status', async (data) => {
      try {
        const { status } = data;
        
        await User.findByIdAndUpdate(socket.userId, { status });
        
        // Notify all channels user is in
        const channels = await Channel.find({
          members: socket.userId,
          isActive: true
        }).select('_id');

        channels.forEach(channel => {
          io.to(`channel-${channel._id}`).emit('user-status-changed', {
            userId: socket.userId,
            status
          });
        });
      } catch (error) {
        console.error('Error updating status:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.user.username} (${socket.id})`);

      // Remove user from active users
      activeUsers.delete(socket.userId);

      // Update user status to offline
      await User.findByIdAndUpdate(socket.userId, {
        status: 'offline',
        lastSeen: new Date()
      });

      // Notify others that user is offline
      socket.broadcast.emit('user-offline', {
        userId: socket.userId
      });
    });
  });
};

module.exports = { socketHandler, activeUsers };
