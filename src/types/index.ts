export interface User {
  username: string;
  name: string;
  role: string;
}

export interface AuthTokens {
  token: string;
  refresh_token: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse extends AuthTokens {
  username: string;
  role: string;
}

export interface RefreshTokenResponse extends AuthTokens {}

export interface Item {
  id: string;
  name: string;
  sku: string;
  description?: string;
  category: string;
  quantity: number;
  unit_price: number;
  min_stock_level: number;
  created_at: string;
  updated_at: string;
}

export interface CreateItemRequest {
  name: string;
  sku: string;
  description?: string;
  category: string;
  quantity: number;
  unit_price: number;
  min_stock_level: number;
}

export interface UpdateItemRequest extends Partial<CreateItemRequest> {}

export interface Order {
  id: string;
  type: 'incoming' | 'outgoing';
  status: 'pending' | 'completed' | 'cancelled';
  supplier_id?: string;
  items: OrderItem[];
  total_amount: number;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface OrderItem {
  item_id: string;
  quantity: number;
  unit_price: number;
  item?: Item;
}

export interface CreateOrderRequest {
  type: 'incoming' | 'outgoing';
  supplier_id?: string;
  items: {
    item_id: string;
    quantity: number;
    unit_price?: number;
  }[];
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSupplierRequest {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface UpdateSupplierRequest extends Partial<CreateSupplierRequest> {}

export interface AuditLog {
  id: string;
  item_id: string;
  action: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  user_id?: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface ApiError {
  message: string;
  status: number;
}