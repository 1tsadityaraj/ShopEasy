const express = require('express');
const router = express.Router();
const {
  getChannels,
  createChannel,
  getChannelMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  addReaction,
  searchMessages
} = require('../controllers/chatController');
const { auth } = require('../middleware/auth');

// All routes are protected
router.use(auth);

// Channel routes
router.get('/channels', getChannels);
router.post('/channels', createChannel);
router.get('/channels/:channelId/messages', getChannelMessages);
router.post('/channels/:channelId/messages', sendMessage);

// Message routes
router.put('/messages/:messageId', editMessage);
router.delete('/messages/:messageId', deleteMessage);
router.post('/messages/:messageId/reactions', addReaction);

// Search route
router.get('/search', searchMessages);

module.exports = router;
