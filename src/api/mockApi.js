const STORAGE_KEYS = {
  inventory: 'warehouse_inventory',
  orders: 'warehouse_orders',
  suppliers: 'warehouse_suppliers'
};

const defaultInventory = [
  { id: '1', name: 'Forklift Battery', sku: 'BAT-204', category: 'Energy', quantity: 16, price: 450 },
  { id: '2', name: 'Shipping Pallet', sku: 'PAL-142', category: 'Storage', quantity: 4, price: 80 },
  { id: '3', name: 'Barcode Scanner', sku: 'SCN-908', category: 'Hardware', quantity: 9, price: 220 }
];

const defaultOrders = [
  { id: 'o1', type: 'Incoming', product: 'Forklift Battery', quantity: 20, status: 'Completed', createdAt: Date.now() - 86400000 },
  { id: 'o2', type: 'Outgoing', product: 'Shipping Pallet', quantity: 6, status: 'Pending', createdAt: Date.now() - 3600000 }
];

const defaultSuppliers = [
  { id: 's1', name: 'Global Logistics', email: 'contact@globallogistics.com', phone: '555-0144', category: 'Transport' },
  { id: 's2', name: 'Raw Materials Co.', email: 'sales@rawmaterials.example', phone: '555-0192', category: 'Packaging' }
];

const createId = () => Math.random().toString(36).slice(2, 10);
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

const readStorage = (key, defaults) => {
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return defaults;
    }
  }
  localStorage.setItem(key, JSON.stringify(defaults));
  return defaults;
};

const writeStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
  return data;
};

export async function login({ email, password }) {
  await delay(600);

  const validEmail = 'admin@warehouse.com';
  const validPassword = 'password';

  if (email === validEmail && password === validPassword) {
    const user = { id: 'u1', name: 'Warehouse Admin', email };
    const token = 'mock-jwt-token';
    return { token, user };
  }

  throw new Error('Invalid email or password. Try admin@warehouse.com / password');
}

export async function fetchInventory() {
  await delay();
  return readStorage(STORAGE_KEYS.inventory, defaultInventory);
}

export async function createInventoryItem(item) {
  await delay();
  const items = readStorage(STORAGE_KEYS.inventory, defaultInventory);
  const next = { ...item, id: createId() };
  items.unshift(next);
  writeStorage(STORAGE_KEYS.inventory, items);
  return next;
}

export async function updateInventoryItem(item) {
  await delay();
  const items = readStorage(STORAGE_KEYS.inventory, defaultInventory).map((existing) =>
    existing.id === item.id ? { ...existing, ...item } : existing
  );
  writeStorage(STORAGE_KEYS.inventory, items);
  return item;
}

export async function deleteInventoryItem(itemId) {
  await delay();
  const items = readStorage(STORAGE_KEYS.inventory, defaultInventory).filter((item) => item.id !== itemId);
  writeStorage(STORAGE_KEYS.inventory, items);
  return itemId;
}

export async function fetchOrders() {
  await delay();
  return readStorage(STORAGE_KEYS.orders, defaultOrders).sort((a, b) => b.createdAt - a.createdAt);
}

export async function createOrder(order) {
  await delay();
  const orders = readStorage(STORAGE_KEYS.orders, defaultOrders);
  const next = { ...order, id: createId(), status: 'Pending', createdAt: Date.now() };
  orders.unshift(next);
  writeStorage(STORAGE_KEYS.orders, orders);
  return next;
}

export async function updateOrderStatus(orderId, status) {
  await delay();
  const orders = readStorage(STORAGE_KEYS.orders, defaultOrders).map((order) =>
    order.id === orderId ? { ...order, status } : order
  );
  writeStorage(STORAGE_KEYS.orders, orders);
  return orders.find((order) => order.id === orderId);
}

export async function fetchSuppliers() {
  await delay();
  return readStorage(STORAGE_KEYS.suppliers, defaultSuppliers);
}

export async function createSupplier(supplier) {
  await delay();
  const suppliers = readStorage(STORAGE_KEYS.suppliers, defaultSuppliers);
  const next = { ...supplier, id: createId() };
  suppliers.unshift(next);
  writeStorage(STORAGE_KEYS.suppliers, suppliers);
  return next;
}

export async function updateSupplier(supplier) {
  await delay();
  const suppliers = readStorage(STORAGE_KEYS.suppliers, defaultSuppliers).map((existing) =>
    existing.id === supplier.id ? { ...existing, ...supplier } : existing
  );
  writeStorage(STORAGE_KEYS.suppliers, suppliers);
  return supplier;
}

export async function deleteSupplier(supplierId) {
  await delay();
  const suppliers = readStorage(STORAGE_KEYS.suppliers, defaultSuppliers).filter((item) => item.id !== supplierId);
  writeStorage(STORAGE_KEYS.suppliers, suppliers);
  return supplierId;
}
