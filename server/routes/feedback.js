const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { authenticateToken } = require('../middleware/auth');
const logger = require('../utils/logger');

router.post('/', authenticateToken, async (req, res) => {
  try {
    const feedback = new Feedback({
      userId: req.user.userId,
      ...req.body
    });
    await feedback.save();
    res.status(201).json(feedback);
  } catch (error) {
    logger.error('Error saving feedback:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;