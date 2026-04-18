import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Paper, Box, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { loginUser } from './authSlice.js';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const [credentials, setCredentials] = useState({ email: 'admin@warehouse.com', password: 'password' });

  useEffect(() => {
    if (auth.token) {
      navigate('/dashboard', { replace: true });
    }
  }, [auth.token, navigate]);

  const handleChange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(loginUser(credentials));
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', bgcolor: '#f4f6fb', p: 3 }}>
      <Paper sx={{ width: '100%', maxWidth: 420, p: 4 }} elevation={3}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Warehouse Login
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Sign in to manage inventory, orders, and suppliers.
        </Typography>
        {auth.error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {auth.error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
          <TextField
            label="Email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            fullWidth
            autoComplete="email"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleChange}
            fullWidth
            autoComplete="current-password"
          />
          <Button type="submit" variant="contained" size="large" disabled={auth.status === 'loading'}>
            {auth.status === 'loading' ? <CircularProgress size={20} /> : 'Sign in'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default LoginPage;
