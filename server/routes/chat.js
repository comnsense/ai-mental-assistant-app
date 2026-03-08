const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const ChatSession = require('../models/ChatSession');
const Message = require('../models/Message');
const { authenticateToken } = require('../middleware/auth');
const logger = require('../utils/logger');

// Get chat history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const sessions = await ChatSession.find({ 
      userId: req.user.userId,
      status: 'ended'
    })
    .sort({ createdAt: -1 })
    .limit(10);

    res.json({ sessions });
  } catch (error) {
    logger.error('Error fetching chat history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get session messages
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

// End session
router.post('/session/:sessionId/end', authenticateToken, async (req, res) => {
  try {
    await ChatSession.findByIdAndUpdate(req.params.sessionId, {
      status: 'ended',
      endedAt: new Date()
    });

    res.json({ message: 'Session ended' });
  } catch (error) {
    logger.error('Error ending session:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;