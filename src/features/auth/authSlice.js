import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login } from '../../api/apiClient.js';

const storedToken = localStorage.getItem('warehouse_token');
const storedUser = localStorage.getItem('warehouse_user');

const initialState = {
  token: storedToken || null,
  user: storedUser ? JSON.parse(storedUser) : null,
  status: 'idle',
  error: null
};

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await login(credentials);
    return response;
  } catch (error) {
    return rejectWithValue(error.message || 'Login failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('warehouse_token');
      localStorage.removeItem('warehouse_user');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('warehouse_token', action.payload.token);
        localStorage.setItem('warehouse_user', JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Unable to login';
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
