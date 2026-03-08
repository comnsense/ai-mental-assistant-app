const jwt = require('jsonwebtoken');
const ChatSession = require('../models/ChatSession');
const Message = require('../models/Message');
const { generateAIResponse, analyzeEmotion } = require('./aiService');
const logger = require('../utils/logger');

const activeSessions = new Map();

const setupSocketHandlers = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

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
        // Create new chat session
        const session = new ChatSession({
          userId: socket.userId,
          status: 'active'
        });
        await session.save();

        socket.sessionId = session._id;
        activeSessions.set(socket.id, {
          userId: socket.userId,
          sessionId: session._id
        });

        socket.emit('session-started', { sessionId: session._id });

        // Welcome message
        const welcomeMessage = new Message({
          chatSessionId: session._id,
          userId: socket.userId,
          messageText: "Здравей! Аз съм твоят виртуален асистент за психично здраве. Как се чувстваш днес?",
          direction: 'ai_to_user',
          emotion: 'neutral',
          sentiment: 0
        });
        await welcomeMessage.save();

        socket.emit('message', {
          message: welcomeMessage.messageText,
          direction: 'ai_to_user',
          timestamp: welcomeMessage.sentAt
        });
      } catch (error) {
        logger.error('Error starting chat:', error);
        socket.emit('error', { message: 'Could not start chat session' });
      }
    });

    socket.on('send-message', async (data) => {
      try {
        const { message, sessionId } = data;
        const session = activeSessions.get(socket.id);

        if (!session || session.sessionId.toString() !== sessionId) {
          socket.emit('error', { message: 'Invalid session' });
          return;
        }

        // Save user message
        const userMessage = new Message({
          chatSessionId: sessionId,
          userId: socket.userId,
          messageText: message,
          direction: 'user_to_ai'
        });
        await userMessage.save();

        // Analyze emotion
        const emotion = await analyzeEmotion(message);
        userMessage.emotion = emotion.emotion;
        userMessage.sentiment = emotion.sentiment;
        await userMessage.save();

        // Generate AI response
        const aiResponse = await generateAIResponse(message, emotion);

        // Save AI response
        const aiMessage = new Message({
          chatSessionId: sessionId,
          userId: socket.userId,
          messageText: aiResponse,
          direction: 'ai_to_user',
          emotion: 'neutral',
          sentiment: 0
        });
        await aiMessage.save();

        // Send response to client
        socket.emit('message', {
          message: aiMessage.messageText,
          direction: 'ai_to_user',
          timestamp: aiMessage.sentAt,
          emotion: emotion.emotion
        });

        // Update session emotion summary
        await ChatSession.findByIdAndUpdate(sessionId, {
          $inc: { [`emotionSummary.${emotion.emotion}`]: 1 }
        });
      } catch (error) {
        logger.error('Error processing message:', error);
        socket.emit('error', { message: 'Could not process message' });
      }
    });

    socket.on('end-chat', async () => {
      try {
        const session = activeSessions.get(socket.id);
        if (session) {
          await ChatSession.findByIdAndUpdate(session.sessionId, {
            status: 'ended',
            endedAt: new Date()
          });
          activeSessions.delete(socket.id);
          socket.emit('chat-ended');
        }
      } catch (error) {
        logger.error('Error ending chat:', error);
      }
    });

    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.userId}`);
      activeSessions.delete(socket.id);
    });
  });
};

module.exports = { setupSocketHandlers };