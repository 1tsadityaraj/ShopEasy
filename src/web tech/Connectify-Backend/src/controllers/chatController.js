const Channel = require('../models/Channel');
const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get all channels for user
// @route   GET /api/chat/channels
// @access  Private
const getChannels = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const channels = await Channel.find({
      members: userId,
      isActive: true
    })
    .populate('members', 'username avatar status lastSeen')
    .populate('createdBy', 'username avatar')
    .populate({
      path: 'lastMessage',
      populate: {
        path: 'sender',
        select: 'username avatar'
      }
    })
    .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: { channels }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new channel
// @route   POST /api/chat/channels
// @access  Private
const createChannel = async (req, res) => {
  try {
    const { name, description, type = 'public', memberIds = [] } = req.body;
    const userId = req.user._id;

    // Add creator to members
    const members = [userId, ...memberIds];

    const channel = await Channel.create({
      name,
      description,
      type,
      members,
      createdBy: userId
    });

    await channel.populate([
      { path: 'members', select: 'username avatar status lastSeen' },
      { path: 'createdBy', select: 'username avatar' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Channel created successfully',
      data: { channel }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get channel messages
// @route   GET /api/chat/channels/:channelId/messages
// @access  Private
const getChannelMessages = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user._id;

    // Check if user is member of channel
    const channel = await Channel.findOne({
      _id: channelId,
      members: userId,
      isActive: true
    });

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: 'Channel not found or access denied'
      });
    }

    const skip = (page - 1) * limit;

    const messages = await Message.find({
      channel: channelId,
      isDeleted: false
    })
    .populate('sender', 'username avatar')
    .populate('replyTo', 'content sender')
    .populate('reactions.user', 'username')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: { 
        messages: messages.reverse(),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: await Message.countDocuments({ channel: channelId, isDeleted: false })
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Send message
// @route   POST /api/chat/channels/:channelId/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { content, type = 'text', replyTo, attachments = [] } = req.body;
    const userId = req.user._id;

    // Check if user is member of channel
    const channel = await Channel.findOne({
      _id: channelId,
      members: userId,
      isActive: true
    });

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: 'Channel not found or access denied'
      });
    }

    const message = await Message.create({
      content,
      sender: userId,
      channel: channelId,
      type,
      replyTo,
      attachments
    });

    await message.populate([
      { path: 'sender', select: 'username avatar' },
      { path: 'replyTo', select: 'content sender' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: { message }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Edit message
// @route   PUT /api/chat/messages/:messageId
// @access  Private
const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    const message = await Message.findOne({
      _id: messageId,
      sender: userId,
      isDeleted: false
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found or access denied'
      });
    }

    message.content = content;
    message.edited = true;
    message.editedAt = new Date();
    await message.save();

    await message.populate([
      { path: 'sender', select: 'username avatar' },
      { path: 'replyTo', select: 'content sender' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Message updated successfully',
      data: { message }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete message
// @route   DELETE /api/chat/messages/:messageId
// @access  Private
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findOne({
      _id: messageId,
      sender: userId,
      isDeleted: false
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found or access denied'
      });
    }

    message.isDeleted = true;
    message.deletedAt = new Date();
    await message.save();

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Add reaction to message
// @route   POST /api/chat/messages/:messageId/reactions
// @access  Private
const addReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user already reacted with this emoji
    const existingReaction = message.reactions.find(
      reaction => reaction.user.toString() === userId.toString() && reaction.emoji === emoji
    );

    if (existingReaction) {
      // Remove reaction
      message.reactions = message.reactions.filter(
        reaction => !(reaction.user.toString() === userId.toString() && reaction.emoji === emoji)
      );
    } else {
      // Add reaction
      message.reactions.push({
        emoji,
        user: userId
      });
    }

    await message.save();
    await message.populate('reactions.user', 'username');

    res.status(200).json({
      success: true,
      message: existingReaction ? 'Reaction removed' : 'Reaction added',
      data: { message }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Search messages
// @route   GET /api/chat/search
// @access  Private
const searchMessages = async (req, res) => {
  try {
    const { q, channelId, page = 1, limit = 20 } = req.query;
    const userId = req.user._id;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const skip = (page - 1) * limit;

    // Build search query
    const searchQuery = {
      content: { $regex: q, $options: 'i' },
      isDeleted: false
    };

    if (channelId) {
      // Check if user is member of channel
      const channel = await Channel.findOne({
        _id: channelId,
        members: userId,
        isActive: true
      });

      if (!channel) {
        return res.status(404).json({
          success: false,
          message: 'Channel not found or access denied'
        });
      }

      searchQuery.channel = channelId;
    } else {
      // Search in all channels user is member of
      const userChannels = await Channel.find({
        members: userId,
        isActive: true
      }).select('_id');

      searchQuery.channel = { $in: userChannels.map(ch => ch._id) };
    }

    const messages = await Message.find(searchQuery)
      .populate('sender', 'username avatar')
      .populate('channel', 'name type')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: { 
        messages,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: await Message.countDocuments(searchQuery)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getChannels,
  createChannel,
  getChannelMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  addReaction,
  searchMessages
};
