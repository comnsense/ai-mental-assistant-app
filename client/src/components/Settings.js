import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Slider
} from '@mui/material';
import {
  DarkMode as DarkModeIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  VolumeUp as VolumeIcon,
  Security as SecurityIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Palette as ThemeIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import toast from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'bg',
    notifications: true,
    soundEnabled: true,
    messageSpeed: 50,
    autoSave: true,
    darkMode: false,
    privacyMode: false
  });

  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();
  const theme = useTheme();

  const handleChange = (setting) => (event) => {
    const value = event.target.type === 'checkbox' 
      ? event.target.checked 
      : event.target.value;
    
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.put('/api/user/settings', settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Настройките са запазени успешно');
    } catch (error) {
      toast.error('Грешка при запазване на настройките');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Сигурни ли сте, че искате да изтриете акаунта си? Това действие е необратимо.')) {
      try {
        await axios.delete('/api/user/account', {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Акаунтът е изтрит');
        // Logout and redirect
      } catch (error) {
        toast.error('Грешка при изтриване на акаунта');
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Настройки
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ThemeIcon color="primary" />
          Изглед
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <FormControlLabel
          control={
            <Switch
              checked={settings.darkMode}
              onChange={handleChange('darkMode')}
              color="primary"
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DarkModeIcon fontSize="small" />
              <span>Тъмен режим</span>
            </Box>
          }
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Език</InputLabel>
          <Select
            value={settings.language}
            onChange={handleChange('language')}
            label="Език"
            startAdornment={<LanguageIcon sx={{ mr: 1, color: 'action.active' }} />}
          >
            <MenuItem value="bg">Български</MenuItem>
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="de">Deutsch</MenuItem>
            <MenuItem value="ru">Русский</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <NotificationsIcon color="primary" />
          Известия
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <FormControlLabel
          control={
            <Switch
              checked={settings.notifications}
              onChange={handleChange('notifications')}
              color="primary"
            />
          }
          label="Разреши известия"
          sx={{ mb: 2, display: 'block' }}
        />

        <FormControlLabel
          control={
            <Switch
              checked={settings.soundEnabled}
              onChange={handleChange('soundEnabled')}
              color="primary"
              disabled={!settings.notifications}
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <VolumeIcon fontSize="small" />
              <span>Звук при ново съобщение</span>
            </Box>
          }
          sx={{ mb: 2, display: 'block' }}
        />
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SpeedIcon color="primary" />
          Поведение на чата
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Typography gutterBottom>
          Скорост на отговорите
        </Typography>
        <Slider
          value={settings.messageSpeed}
          onChange={handleChange('messageSpeed')}
          valueLabelDisplay="auto"
          step={10}
          marks
          min={0}
          max={100}
          sx={{ mb: 3 }}
        />

        <FormControlLabel
          control={
            <Switch
              checked={settings.autoSave}
              onChange={handleChange('autoSave')}
              color="primary"
            />
          }
          label="Автоматично запазване на чат историята"
          sx={{ mb: 2, display: 'block' }}
        />

        <FormControlLabel
          control={
            <Switch
              checked={settings.privacyMode}
              onChange={handleChange('privacyMode')}
              color="primary"
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SecurityIcon fontSize="small" />
              <span>Режим на поверителност (не запазва историята)</span>
            </Box>
          }
        />
      </Paper>

      <Paper sx={{ p: 3, mb: 3, bgcolor: '#fff3e0' }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'error.main', display: 'flex', alignItems: 'center', gap: 1 }}>
          <DeleteIcon />
          Зона за риск
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Alert severity="warning" sx={{ mb: 3 }}>
          Тези действия са необратими. Моля, бъдете внимателни.
        </Alert>

        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDeleteAccount}
          sx={{ mr: 2 }}
        >
          Изтриване на акаунта
        </Button>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={loading}
          size="large"
        >
          {loading ? 'Запазване...' : 'Запазване на настройките'}
        </Button>
      </Box>
    </Container>
  );
};

export default Settings;