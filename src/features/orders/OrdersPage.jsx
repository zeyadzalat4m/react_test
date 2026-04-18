import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Button,
  MenuItem,
  Stack,
  TextField,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AppShell from '../../components/AppShell.jsx';
import DataTable from '../../components/DataTable.jsx';
import { fetchOrders, addOrder, changeOrderStatus } from './ordersSlice.js';

const orderFormDefaults = { product: '', type: 'Incoming', quantity: '', notes: '' };

function OrdersPage() {
  const dispatch = useDispatch();
  const { orders, status, error } = useSelector((state) => state.orders);
  const [formData, setFormData] = useState(orderFormDefaults);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'quantity' ? Number(value) : value }));
  };

  const handleCreate = () => {
    dispatch(addOrder({ ...formData, quantity: Number(formData.quantity) }));
    setFormData(orderFormDefaults);
  };

  const handleStatusUpdate = (orderId, statusValue) => {
    dispatch(changeOrderStatus({ orderId, status: statusValue }));
  };

  return (
    <AppShell>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} mb={3}>
        <Box>
          <Typography variant="h4">Orders</Typography>
          <Typography color="text.secondary">Manage incoming and outgoing warehouse orders.</Typography>
        </Box>
      </Stack>

      {status === 'loading' && <CircularProgress />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" mb={2}>Create New Order</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <TextField label="Product" name="product" value={formData.product} onChange={handleChange} fullWidth />
          <TextField select label="Type" name="type" value={formData.type} onChange={handleChange} sx={{ minWidth: 160 }}>
            <MenuItem value="Incoming">Incoming</MenuItem>
            <MenuItem value="Outgoing">Outgoing</MenuItem>
          </TextField>
          <TextField label="Quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} sx={{ minWidth: 140 }} />
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
            Create
          </Button>
        </Stack>
      </Paper>

      <DataTable
        columns={[
          { field: 'product', headerName: 'Product' },
          { field: 'type', headerName: 'Type' },
          { field: 'quantity', headerName: 'Quantity', align: 'right' },
          { field: 'status', headerName: 'Status', align: 'center', valueGetter: (row) => (
              <Chip label={row.status} color={row.status === 'Completed' ? 'success' : 'warning'} size="small" />
            ) }
        ]}
        rows={orders}
        renderActions={(row) => (
          <Stack direction="row" spacing={1} justifyContent="center">
            {row.status !== 'Completed' && (
              <Button size="small" variant="outlined" onClick={() => handleStatusUpdate(row.id, 'Completed')}>
                Complete
              </Button>
            )}
            <Button size="small" onClick={() => handleStatusUpdate(row.id, 'Pending')}>
              Revert
            </Button>
          </Stack>
        )}
      />
    </AppShell>
  );
}

export default OrdersPage;
