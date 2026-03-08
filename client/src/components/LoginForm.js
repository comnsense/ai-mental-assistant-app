import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Divider,
  Alert,
  Link
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  Facebook as FacebookIcon
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as yup from 'yup';
import { useFormik } from 'formik';

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Въведете валиден имейл')
    .required('Имейлът е задължителен'),
  password: yup
    .string()
    .min(6, 'Паролата трябва да е поне 6 символа')
    .required('Паролата е задължителна'),
});

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setError('');
      setLoading(true);
      
      try {
        await login(values.email, values.password);
        navigate('/chat');
      } catch (err) {
        setError(err.response?.data?.message || 'Грешка при вход');
      } finally {
        setLoading(false);
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 4, 
        width: '100%',
        maxWidth: 400,
        mx: 'auto'
      }}
    >
      <Typography 
        variant="h4" 
        align="center" 
        gutterBottom
        sx={{ 
          fontWeight: 'bold',
          color: 'primary.main',
          mb: 3
        }}
      >
        Добре дошли
      </Typography>

      <Typography 
        variant="body2" 
        align="center" 
        color="textSecondary"
        sx={{ mb: 3 }}
      >
        Влезте в своя акаунт, за да продължите
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="email"
          name="email"
          label="Имейл"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          id="password"
          name="password"
          label="Парола"
          type={showPassword ? 'text' : 'password'}
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={loading}
          sx={{ 
            mt: 3, 
            mb: 2,
            py: 1.5
          }}
        >
          {loading ? 'Влизане...' : 'Вход'}
        </Button>

        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Link 
            component={RouterLink} 
            to="/register" 
            variant="body2"
            sx={{ textDecoration: 'none' }}
          >
            Нямате профил? Регистрирайте се
          </Link>
        </Box>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="textSecondary">
            или
          </Typography>
        </Divider>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{ py: 1.5 }}
          >
            Google
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<FacebookIcon />}
            sx={{ py: 1.5 }}
          >
            Facebook
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default LoginForm;