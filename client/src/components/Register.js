import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFormik } from 'formik';
import * as yup from 'yup';

const steps = ['Създаване на профил', 'Потвърждение'];

const validationSchema = yup.object({
  username: yup
    .string()
    .min(3, 'Потребителското име трябва да е поне 3 символа')
    .required('Потребителското име е задължително'),
  email: yup
    .string()
    .email('Въведете валиден имейл')
    .required('Имейлът е задължителен'),
  password: yup
    .string()
    .min(6, 'Паролата трябва да е поне 6 символа')
    .matches(/[0-9]/, 'Паролата трябва да съдържа поне една цифра')
    .matches(/[a-zA-Z]/, 'Паролата трябва да съдържа поне една буква')
    .required('Паролата е задължителна'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Паролите не съвпадат')
    .required('Потвърдете паролата'),
});

const Register = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { register } = useAuth();

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setError('');
      setLoading(true);
      
      try {
        await register(values.username, values.email, values.password);
        setActiveStep(1);
        setTimeout(() => {
          navigate('/chat');
        }, 2000);
      } catch (err) {
        setError(err.response?.data?.message || 'Грешка при регистрация');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Регистрация
          </Typography>

          <Stepper activeStep={activeStep} sx={{ my: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 ? (
            <>
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={formik.handleSubmit}>
                <TextField
                  fullWidth
                  id="username"
                  name="username"
                  label="Потребителско име"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  error={formik.touched.username && Boolean(formik.errors.username)}
                  helperText={formik.touched.username && formik.errors.username}
                  margin="normal"
                />

                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Имейл"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  margin="normal"
                />

                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="Парола"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  margin="normal"
                />

                <TextField
                  fullWidth
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Потвърдете паролата"
                  type="password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                  helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                  margin="normal"
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ mt: 3, mb: 2, py: 1.5 }}
                >
                  {loading ? 'Регистрация...' : 'Регистрирай се'}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Link component={RouterLink} to="/login" variant="body2">
                    Вече имате профил? Влезте
                  </Link>
                </Box>
              </form>
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" gutterBottom color="success.main">
                Регистрацията е успешна!
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Пренасочваме ви към чата...
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;