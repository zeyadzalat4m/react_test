import { useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import DashboardPage from './features/dashboard/DashboardPage.jsx';
import InventoryPage from './features/inventory/InventoryPage.jsx';
import OrdersPage from './features/orders/OrdersPage.jsx';
import SuppliersPage from './features/suppliers/SuppliersPage.jsx';
import LoginPage from './features/auth/LoginPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'light',
          primary: { main: '#1565c0' },
          secondary: { main: '#ff9800' }
        }
      }),
    []
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/suppliers" element={<SuppliersPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
