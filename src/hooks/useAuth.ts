import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiClient } from '../api/apiClient';
import type { LoginRequest, LoginResponse, User } from '../types';

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => apiClient.login(credentials),
    onSuccess: (data: LoginResponse) => {
      const user: User = {
        username: data.username,
        name: data.username,
        role: data.role,
      };

      localStorage.setItem('warehouse_token', data.token);
      localStorage.setItem('warehouse_refresh_token', data.refresh_token);
      localStorage.setItem('warehouse_user', JSON.stringify(user));

      queryClient.setQueryData(['user'], user);
      toast.success('Login successful!');
      navigate('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return () => {
    localStorage.removeItem('warehouse_token');
    localStorage.removeItem('warehouse_refresh_token');
    localStorage.removeItem('warehouse_user');
    queryClient.clear();
    navigate('/login');
    toast.info('Logged out successfully');
  };
};

export const getStoredUser = (): User | null => {
  const userStr = localStorage.getItem('warehouse_user');
  return userStr ? JSON.parse(userStr) : null;
};

export const getStoredToken = (): string | null => {
  return localStorage.getItem('warehouse_token');
};

export const isAuthenticated = (): boolean => {
  return !!getStoredToken();
};