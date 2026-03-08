const jwt = require('jsonwebtoken');
const ChatSession = require('../models/ChatSession');
const Message = require('../models/Message');
const { generateAIResponse, analyzeEmotion } = require('./aiService');
const logger = require('../utils/logger');

const setupSocketHandlers = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.userId}`);

    socket.on('start-chat', async () => {
      try {
        const session = new ChatSession({
          userId: socket.userId,
          status: 'active'
        });
        await session.save();
        socket.sessionId = session._id;

        socket.emit('session-started', { sessionId: session._id });

        const welcomeMessage = "Здравей! Аз съм твоят виртуален асистент. Как се чувстваш днес?";
        
        const message = new Message({
          chatSessionId: session._id,
          userId: socket.userId,
          messageText: welcomeMessage,
          direction: 'ai_to_user'
        });
        await message.save();

        socket.emit('message', {
          message: welcomeMessage,
          direction: 'ai_to_user',
          timestamp: message.sentAt
        });
      } catch (error) {
        logger.error('Error starting chat:', error);
        socket.emit('error', { message: 'Could not start chat' });
      }
    });

    socket.on('send-message', async (data) => {
      try {
        const { message, sessionId } = data;

        const userMessage = new Message({
          chatSessionId: sessionId,
          userId: socket.userId,
          messageText: message,
          direction: 'user_to_ai'
        });
        await userMessage.save();

        const emotion = await analyzeEmotion(message);
        const aiResponse = await generateAIResponse(message, emotion);

        const aiMessage = new Message({
          chatSessionId: sessionId,
          userId: socket.userId,
          messageText: aiResponse,
          direction: 'ai_to_user'
        });
        await aiMessage.save();

        socket.emit('message', {
          message: aiResponse,
          direction: 'ai_to_user',
          timestamp: aiMessage.sentAt,
          emotion
        });
      } catch (error) {
        logger.error('Error processing message:', error);
        socket.emit('error', { message: 'Could not process message' });
      }
    });

    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.userId}`);
    });
  });
};

module.exports = { setupSocketHandlers };