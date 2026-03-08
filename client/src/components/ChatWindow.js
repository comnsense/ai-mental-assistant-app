import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  CircularProgress,
  Fade
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  FiberManualRecord as OnlineIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';

const ChatWindow = ({ sessionId, onSessionEnd }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  const { socket, connected, sendMessage } = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (socket) {
      socket.on('message', handleNewMessage);
      socket.on('typing', () => setIsTyping(true));
      socket.on('message-sent', () => setIsTyping(false));
      
      return () => {
        socket.off('message', handleNewMessage);
        socket.off('typing');
        socket.off('message-sent');
      };
    }
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNewMessage = (message) => {
    setMessages(prev => [...prev, {
      ...message,
      timestamp: new Date(message.timestamp)
    }]);
    setIsTyping(false);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !sessionId || !connected) return;

    const messageText = inputMessage;
    setInputMessage('');
    
    // Add user message to UI
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    }]);

    // Send to server
    sendMessage(messageText, sessionId);
    setIsTyping(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (date) => {
    return format(date, 'HH:mm', { locale: bg });
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden',
        bgcolor: '#f8f9fa'
      }}
    >
      {/* Chat Header */}
      <Box sx={{ 
        p: 2, 
        bgcolor: 'primary.main', 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <Avatar sx={{ bgcolor: 'secondary.main' }}>
          <BotIcon />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            AI Асистент
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <OnlineIcon sx={{ 
              fontSize: 12, 
              color: connected ? '#4caf50' : '#ff9800',
              animation: connected ? 'pulse 2s infinite' : 'none'
            }} />
            <Typography variant="caption">
              {connected ? 'на линия' : 'свързване...'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Messages Area */}
      <Box sx={{ 
        flex: 1, 
        overflowY: 'auto', 
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        {messages.map((message, index) => (
          <Fade in key={message.id || index}>
            <Box sx={{
              display: 'flex',
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
              mb: 1
            }}>
              <Box sx={{
                display: 'flex',
                flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                gap: 1,
                maxWidth: '70%'
              }}>
                <Avatar sx={{ 
                  width: 32, 
                  height: 32,
                  bgcolor: message.sender === 'user' ? 'secondary.main' : 'primary.main'
                }}>
                  {message.sender === 'user' ? <PersonIcon /> : <BotIcon />}
                </Avatar>
                
                <Paper sx={{
                  p: 2,
                  bgcolor: message.sender === 'user' ? 'primary.main' : 'white',
                  color: message.sender === 'user' ? 'white' : 'text.primary',
                  borderRadius: 2,
                  position: 'relative',
                  wordBreak: 'break-word'
                }}>
                  {message.sender === 'ai' ? (
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  ) : (
                    <Typography variant="body1">{message.text}</Typography>
                  )}
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      display: 'block', 
                      mt: 1,
                      opacity: 0.7,
                      fontSize: '0.7rem'
                    }}
                  >
                    {formatMessageTime(message.timestamp)}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Fade>
        ))}
        
        {isTyping && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                <BotIcon />
              </Avatar>
              <Paper sx={{ p: 2, bgcolor: 'white' }}>
                <CircularProgress size={20} />
              </Paper>
            </Box>
          </Box>
        )}
        
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box sx={{ 
        p: 2, 
        bgcolor: 'white',
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder={connected ? "Напишете съобщение..." : "Свързване със сървъра..."}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!connected || !sessionId || isLoading}
            inputRef={inputRef}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || !connected || !sessionId || isLoading}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark'
              },
              '&:disabled': {
                bgcolor: 'grey.300'
              }
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
        {!connected && (
          <Typography 
            variant="caption" 
            color="warning.main"
            sx={{ display: 'block', mt: 1, textAlign: 'center' }}
          >
            Свързване със сървъра... Моля, изчакайте.
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default ChatWindow;