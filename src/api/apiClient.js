import axios from 'axios';
import * as mockApi from './mockApi.js';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const useMock = import.meta.env.VITE_USE_MOCK_API === 'true' || !baseURL;

const api = axios.create({
  baseURL,
  timeout: 10000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('warehouse_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function login(credentials) {
  if (useMock) {
    return mockApi.login(credentials);
  }

  const response = await api.post('/auth/login', credentials);
  return response.data;
}

export async function fetchInventory() {
  if (useMock) {
    return mockApi.fetchInventory();
  }

  const response = await api.get('/inventory');
  return response.data;
}

export async function createInventoryItem(item) {
  if (useMock) {
    return mockApi.createInventoryItem(item);
  }

  const response = await api.post('/inventory', item);
  return response.data;
}

export async function updateInventoryItem(item) {
  if (useMock) {
    return mockApi.updateInventoryItem(item);
  }

  const response = await api.put(`/inventory/${item.id}`, item);
  return response.data;
}

export async function deleteInventoryItem(itemId) {
  if (useMock) {
    return mockApi.deleteInventoryItem(itemId);
  }

  const response = await api.delete(`/inventory/${itemId}`);
  return response.data;
}

export async function fetchOrders() {
  if (useMock) {
    return mockApi.fetchOrders();
  }

  const response = await api.get('/orders');
  return response.data;
}

export async function createOrder(order) {
  if (useMock) {
    return mockApi.createOrder(order);
  }

  const response = await api.post('/orders', order);
  return response.data;
}

export async function updateOrderStatus(orderId, status) {
  if (useMock) {
    return mockApi.updateOrderStatus(orderId, status);
  }

  const response = await api.patch(`/orders/${orderId}`, { status });
  return response.data;
}

export async function fetchSuppliers() {
  if (useMock) {
    return mockApi.fetchSuppliers();
  }

  const response = await api.get('/suppliers');
  return response.data;
}

export async function createSupplier(supplier) {
  if (useMock) {
    return mockApi.createSupplier(supplier);
  }

  const response = await api.post('/suppliers', supplier);
  return response.data;
}

export async function updateSupplier(supplier) {
  if (useMock) {
    return mockApi.updateSupplier(supplier);
  }

  const response = await api.put(`/suppliers/${supplier.id}`, supplier);
  return response.data;
}

export async function deleteSupplier(supplierId) {
  if (useMock) {
    return mockApi.deleteSupplier(supplierId);
  }

  const response = await api.delete(`/suppliers/${supplierId}`);
  return response.data;
}
