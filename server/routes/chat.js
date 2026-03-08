const express = require('express');
const router = express.Router();
const ChatSession = require('../models/ChatSession');
const Message = require('../models/Message');
const { authenticateToken } = require('../middleware/auth');
const logger = require('../utils/logger');

router.get('/history', authenticateToken, async (req, res) => {
  try {
    const sessions = await ChatSession.find({ 
      userId: req.user.userId 
    }).sort({ createdAt: -1 }).limit(10);
    
    res.json({ sessions });
  } catch (error) {
    logger.error('Error fetching history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/session/:sessionId', authenticateToken, async (req, res) => {
  try {
    const messages = await Message.find({ 
      chatSessionId: req.params.sessionId 
    }).sort({ sentAt: 1 });
    
    res.json({ messages });
  } catch (error) {
    logger.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;