import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './features/dashboard/DashboardPage.tsx';
import InventoryPage from './features/inventory/InventoryPage.tsx';
import OrdersPage from './features/orders/OrdersPage.tsx';
import SuppliersPage from './features/suppliers/SuppliersPage.tsx';
import LoginPage from './features/auth/LoginPage.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import AppShell from './components/AppShell.tsx';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><AppShell><DashboardPage /></AppShell></ProtectedRoute>} />
      <Route path="/inventory" element={<ProtectedRoute><AppShell><InventoryPage /></AppShell></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><AppShell><OrdersPage /></AppShell></ProtectedRoute>} />
      <Route path="/suppliers" element={<ProtectedRoute><AppShell><SuppliersPage /></AppShell></ProtectedRoute>} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
