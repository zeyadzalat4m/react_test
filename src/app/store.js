import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import inventoryReducer from '../features/inventory/inventorySlice.js';
import ordersReducer from '../features/orders/ordersSlice.js';
import suppliersReducer from '../features/suppliers/suppliersSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    inventory: inventoryReducer,
    orders: ordersReducer,
    suppliers: suppliersReducer
  }
});
