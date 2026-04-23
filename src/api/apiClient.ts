import axios, { AxiosInstance } from 'axios';
import * as mockApi from './mockApi';
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  Item,
  CreateItemRequest,
  UpdateItemRequest,
  Order,
  CreateOrderRequest,
  Supplier,
  CreateSupplierRequest,
  UpdateSupplierRequest,
  AuditLog,
  PaginatedResponse,
} from '../types';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const useMock = import.meta.env.VITE_USE_MOCK_API === 'true';

// Transform API response to match Item interface
const transformItem = (apiItem: any): Item => {
  return {
    id: apiItem.id,
    name: apiItem.name,
    sku: apiItem.sku,
    description: apiItem.description || '',
    category: apiItem.category,
    quantity: apiItem.quantity,
    unit_price: apiItem.price || apiItem.unit_price || 0,
    min_stock_level: apiItem.min_stock_level || 0,
    created_at: apiItem.createdAt || apiItem.created_at || new Date().toISOString(),
    updated_at: apiItem.updatedAt || apiItem.updated_at || new Date().toISOString(),
  };
};

// Transform API response to match Order interface
const transformOrder = (apiOrder: any): Order => {
  return {
    id: apiOrder.id,
    type: apiOrder.type,
    status: apiOrder.status,
    supplier_id: apiOrder.supplier_id || apiOrder.supplierId,
    items: (apiOrder.items || []).map((item: any) => ({
      item_id: item.item_id || item.itemId,
      quantity: item.quantity,
      unit_price: item.unit_price || item.unitPrice || item.price || 0,
      item: item.item ? transformItem(item.item) : undefined,
    })),
    total_amount: apiOrder.total_amount || apiOrder.totalAmount || 0,
    created_at: apiOrder.createdAt || apiOrder.created_at || new Date().toISOString(),
    updated_at: apiOrder.updatedAt || apiOrder.updated_at || new Date().toISOString(),
    completed_at: apiOrder.completedAt || apiOrder.completed_at,
  };
};

// Transform API response to match Supplier interface
const transformSupplier = (apiSupplier: any): Supplier => {
  return {
    id: apiSupplier.id,
    name: apiSupplier.name,
    email: apiSupplier.email,
    phone: apiSupplier.phone,
    address: apiSupplier.address,
    created_at: apiSupplier.createdAt || apiSupplier.created_at || new Date().toISOString(),
    updated_at: apiSupplier.updatedAt || apiSupplier.updated_at || new Date().toISOString(),
  };
};

class ApiClient {
  private client: AxiosInstance;
  private refreshPromise: Promise<RefreshTokenResponse> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
    });

    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('warehouse_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Try to refresh token
          try {
            await this.refreshToken();
            // Retry the original request
            const token = localStorage.getItem('warehouse_token');
            error.config.headers.Authorization = `Bearer ${token}`;
            return this.client.request(error.config);
          } catch (refreshError) {
            // Refresh failed, redirect to login
            localStorage.removeItem('warehouse_token');
            localStorage.removeItem('warehouse_refresh_token');
            localStorage.removeItem('warehouse_user');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private async refreshToken(): Promise<RefreshTokenResponse> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.client.post<RefreshTokenResponse>('/auth-api/token/refresh', {
      refresh_token: localStorage.getItem('warehouse_refresh_token'),
    }).then(response => {
      const { token, refresh_token } = response.data;
      localStorage.setItem('warehouse_token', token);
      if (refresh_token) {
        localStorage.setItem('warehouse_refresh_token', refresh_token);
      }
      return response.data;
    }).finally(() => {
      this.refreshPromise = null;
    });

    return this.refreshPromise;
  }

  // Auth methods
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    if (useMock) {
      const result = await mockApi.login({ email: credentials.username, password: credentials.password });
      return {
        token: result.token,
        refresh_token: '', // Mock doesn't provide refresh token
        username: result.user.email, // Use email as username
        role: 'admin', // Default role for mock
      };
    }
    const response = await this.client.post<LoginResponse>('/auth-api/login', credentials);
    return response.data;
  }

  async refreshTokenPublic(): Promise<RefreshTokenResponse> {
    const response = await this.client.post<RefreshTokenResponse>('/auth-api/token/refresh', {
      refresh_token: localStorage.getItem('warehouse_refresh_token'),
    });
    return response.data;
  }

  async healthCheck(): Promise<{ status: string }> {
    const response = await this.client.get<{ status: string }>('/auth-api/health');
    return response.data;
  }

  // Items
  async getItems(params?: { limit?: number; offset?: number; search?: string; category?: string }): Promise<PaginatedResponse<Item>> {
    if (useMock) {
      return mockApi.fetchInventory();
    }
    const response = await this.client.get<any>('/warehouse-api/items', { params });
    
    // Handle both array and paginated response formats
    const items = Array.isArray(response.data) ? response.data : response.data.data || [];
    
    return {
      data: items.map(transformItem),
      total: items.length,
      limit: params?.limit || 50,
      offset: params?.offset || 0,
    };
  }

  async getItem(id: string): Promise<Item> {
    if (useMock) {
      const items = await mockApi.fetchInventory();
      const item = items.data.find((item: any) => item.id === id);
      if (!item) throw new Error('Item not found');
      return item;
    }
    const response = await this.client.get<any>(`/warehouse-api/items/${id}`);
    return transformItem(response.data);
  }

  async createItem(item: CreateItemRequest): Promise<Item> {
    if (useMock) {
      return mockApi.createInventoryItem(item);
    }
    const response = await this.client.post<any>('/warehouse-api/items', item);
    return transformItem(response.data);
  }

  async updateItem(id: string, item: UpdateItemRequest): Promise<Item> {
    if (useMock) {
      return mockApi.updateInventoryItem({ ...item, id });
    }
    const response = await this.client.put<any>(`/warehouse-api/items/${id}`, item);
    return transformItem(response.data);
  }

  async deleteItem(id: string): Promise<void> {
    if (useMock) {
      return mockApi.deleteInventoryItem(id);
    }
    await this.client.delete(`/warehouse-api/items/${id}`);
  }

  // Orders
  async getOrders(params?: { limit?: number; offset?: number; status?: string }): Promise<PaginatedResponse<Order>> {
    if (useMock) {
      return mockApi.fetchOrders();
    }
    const response = await this.client.get<any>('/warehouse-api/orders', { params });
    
    // Handle both array and paginated response formats
    const orders = Array.isArray(response.data) ? response.data : response.data.data || [];
    
    return {
      data: orders.map(transformOrder),
      total: orders.length,
      limit: params?.limit || 50,
      offset: params?.offset || 0,
    };
  }

  async getOrder(id: string): Promise<Order> {
    if (useMock) {
      const orders = await mockApi.fetchOrders();
      const order = orders.data.find((order: any) => order.id === id);
      if (!order) throw new Error('Order not found');
      return order;
    }
    const response = await this.client.get<any>(`/warehouse-api/orders/${id}`);
    return transformOrder(response.data);
  }

  async createOrder(order: CreateOrderRequest): Promise<Order> {
    if (useMock) {
      return mockApi.createOrder(order);
    }
    // Transform the order to match backend API format
    const backendOrder: any = {
      type: order.type.charAt(0).toUpperCase() + order.type.slice(1), // Capitalize: 'incoming' -> 'Incoming'
      items: order.items.map(item => ({
        itemId: item.item_id, // Convert item_id to itemId
        quantity: item.quantity,
      })),
    };
    
    // Include supplier_id only if it exists (for incoming orders)
    if (order.supplier_id) {
      backendOrder.supplierId = order.supplier_id;
    }
    
    const response = await this.client.post<any>('/warehouse-api/orders', backendOrder);
    return transformOrder(response.data);
  }

  async completeOrder(id: string): Promise<Order> {
    if (useMock) {
      return mockApi.updateOrderStatus(id, 'completed');
    }
    const response = await this.client.post<any>(`/warehouse-api/orders/${id}/complete`);
    return transformOrder(response.data);
  }

  // Suppliers
  async getSuppliers(params?: { limit?: number; offset?: number }): Promise<PaginatedResponse<Supplier>> {
    if (useMock) {
      return mockApi.fetchSuppliers();
    }
    const response = await this.client.get<any>('/warehouse-api/suppliers', { params });
    
    // Handle both array and paginated response formats
    const suppliers = Array.isArray(response.data) ? response.data : response.data.data || [];
    
    return {
      data: suppliers.map(transformSupplier),
      total: suppliers.length,
      limit: params?.limit || 50,
      offset: params?.offset || 0,
    };
  }

  async getSupplier(id: string): Promise<Supplier> {
    if (useMock) {
      const suppliers = await mockApi.fetchSuppliers();
      const supplier = suppliers.data.find((supplier: any) => supplier.id === id);
      if (!supplier) throw new Error('Supplier not found');
      return supplier;
    }
    const response = await this.client.get<any>(`/warehouse-api/suppliers/${id}`);
    return transformSupplier(response.data);
  }

  async createSupplier(supplier: CreateSupplierRequest): Promise<Supplier> {
    if (useMock) {
      return mockApi.createSupplier(supplier);
    }
    const response = await this.client.post<any>('/warehouse-api/suppliers', supplier);
    return transformSupplier(response.data);
  }

  async updateSupplier(id: string, supplier: UpdateSupplierRequest): Promise<Supplier> {
    if (useMock) {
      return mockApi.updateSupplier({ ...supplier, id });
    }
    const response = await this.client.put<any>(`/warehouse-api/suppliers/${id}`, supplier);
    return transformSupplier(response.data);
  }

  async deleteSupplier(id: string): Promise<void> {
    if (useMock) {
      return mockApi.deleteSupplier(id);
    }
    await this.client.delete(`/warehouse-api/suppliers/${id}`);
  }

  // Audit Logs
  async getAuditLogs(itemId: string, params?: { limit?: number; offset?: number }): Promise<PaginatedResponse<AuditLog>> {
    const response = await this.client.get<PaginatedResponse<AuditLog>>(`/warehouse-api/audit-logs/items/${itemId}`, { params });
    return response.data;
  }
}

export const apiClient = new ApiClient();
