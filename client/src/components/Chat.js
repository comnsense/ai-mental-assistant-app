import React, { useState, useEffect, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Avatar,
  Badge,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Menu as MenuIcon,
  Send as SendIcon,
  Chat as ChatIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const { socket, connected, startChat, sendMessage, endChat } = useSocket();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (socket && connected) {
      startChat();

      socket.on('message', (message) => {
        setMessages(prev => [...prev, message]);
        setIsTyping(false);
        scrollToBottom();
      });

      socket.on('session-started', (data) => {
        setSessionId(data.sessionId);
      });

      socket.on('typing', () => {
        setIsTyping(true);
        scrollToBottom();
      });

      socket.on('error', (error) => {
        toast.error(error.message);
        setIsTyping(false);
      });

      socket.on('chat-ended', () => {
        setSessionId(null);
        toast.success('Чат сесията приключи');
      });
    }

    return () => {
      if (socket) {
        socket.off('message');
        socket.off('session-started');
        socket.off('typing');
        socket.off('error');
        socket.off('chat-ended');
      }
    };
  }, [socket, connected, startChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !sessionId) return;

    const messageText = inputMessage;
    setInputMessage('');
    
    // Add user message to UI
    setMessages(prev => [...prev, {
      message: messageText,
      direction: 'user_to_ai',
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

  const handleEndChat = async () => {
    if (sessionId) {
      await endChat();
    }
    setSessionId(null);
    setMessages([]);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            AI Mental Assistant
          </Typography>
          <IconButton color="inherit" onClick={handleMenuClick}>
            <Badge color="secondary" variant="dot" invisible={connected}>
              <PersonIcon />
            </Badge>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem disabled>
              <Typography variant="body2">{user?.username}</Typography>
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate('/dashboard'); }}>
              <DashboardIcon sx={{ mr: 1 }} /> Табло
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate('/settings'); }}>
              <SettingsIcon sx={{ mr: 1 }} /> Настройки
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} /> Изход
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            marginTop: '64px'
          }
        }}
      >
        <List>
          <ListItem button onClick={() => navigate('/dashboard')}>
            <DashboardIcon sx={{ mr: 2 }} />
            <ListItemText primary="Табло" />
          </ListItem>
          <ListItem button onClick={() => navigate('/settings')}>
            <SettingsIcon sx={{ mr: 2 }} />
            <ListItemText primary="Настройки" />
          </ListItem>
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          marginTop: '64px'
        }}
      >
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: msg.direction === 'user_to_ai' ? 'flex-end' : 'flex-start',
                mb: 1
              }}
            >
              <Box
                sx={{
                  maxWidth: '70%',
                  p: 2,
                  borderRadius: 2,
                  bgcolor: msg.direction === 'user_to_ai' ? 'primary.main' : 'grey.300',
                  color: msg.direction === 'user_to_ai' ? 'white' : 'text.primary'
                }}
              >
                <Typography variant="body1">{msg.message}</Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.7 }}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </Typography>
              </Box>
            </Box>
          ))}
          
          {isTyping && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
              <Box sx={{ bgcolor: 'grey.300', p: 2, borderRadius: 2 }}>
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </Box>
            </Box>
          )}
          
          <div ref={messagesEndRef} />
        </Box>

        <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={sessionId ? "Напиши съобщение..." : "Започни нов чат..."}
              disabled={!sessionId}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '16px'
              }}
            />
            <button
              onClick={sessionId ? handleSendMessage : startChat}
              disabled={sessionId ? !inputMessage.trim() : false}
              style={{
                padding: '10px 20px',
                backgroundColor: '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              {sessionId ? <SendIcon /> : <ChatIcon />}
            </button>
            {sessionId && (
              <button
                onClick={handleEndChat}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Край
              </button>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Chat;