const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chatSessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatSession',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messageText: {
    type: String,
    required: true
  },
  emotion: {
    type: String,
    enum: ['neutral', 'happy', 'sad', 'angry', 'anxious', 'stressed'],
    default: 'neutral'
  },
  sentiment: {
    type: Number,
    min: -1,
    max: 1,
    default: 0
  },
  direction: {
    type: String,
    enum: ['user_to_ai', 'ai_to_user'],
    required: true
  },
  sentAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', messageSchema);