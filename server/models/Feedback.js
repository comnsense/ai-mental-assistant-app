const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  chatSessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatSession'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  feedbackText: {
    type: String,
    maxlength: 1000
  },
  category: {
    type: String,
    enum: ['general', 'technical', 'content', 'suggestion'],
    default: 'general'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Feedback', feedbackSchema);