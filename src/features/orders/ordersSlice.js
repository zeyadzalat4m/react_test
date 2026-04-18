import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchOrders as fetchOrdersApi, createOrder, updateOrderStatus } from '../../api/apiClient.js';

const initialState = {
  orders: [],
  status: 'idle',
  error: null
};

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    return await fetchOrdersApi();
  } catch (error) {
    return rejectWithValue(error.message || 'Unable to load orders');
  }
});

export const addOrder = createAsyncThunk('orders/addOrder', async (order, { rejectWithValue }) => {
  try {
    return await createOrder(order);
  } catch (error) {
    return rejectWithValue(error.message || 'Unable to create order');
  }
});

export const changeOrderStatus = createAsyncThunk('orders/changeOrderStatus', async ({ orderId, status }, { rejectWithValue }) => {
  try {
    return await updateOrderStatus(orderId, status);
  } catch (error) {
    return rejectWithValue(error.message || 'Unable to update order status');
  }
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.orders.unshift(action.payload);
      })
      .addCase(changeOrderStatus.fulfilled, (state, action) => {
        state.orders = state.orders.map((order) => (order.id === action.payload.id ? action.payload : order));
      });
  }
});

export default ordersSlice.reducer;
