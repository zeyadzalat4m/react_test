import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Paper, Typography, Button, Chip, Stack, TextField, CircularProgress, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AppShell from '../../components/AppShell.jsx';
import DataTable from '../../components/DataTable.jsx';
import ModalForm from '../../components/ModalForm.jsx';
import {
  fetchInventory,
  addInventoryItem,
  editInventoryItem,
  removeInventoryItem
} from './inventorySlice.js';

const emptyForm = { name: '', sku: '', category: '', quantity: '', price: '' };

function InventoryPage() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.inventory);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  const lowStockCount = useMemo(() => items.filter((item) => item.quantity <= 5).length, [items]);

  const openDialog = (item = null) => {
    setSelectedItem(item);
    setFormData(item ? { ...item } : emptyForm);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedItem(null);
    setFormData(emptyForm);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'quantity' || name === 'price' ? Number(value) : value }));
  };

  const handleSave = () => {
    const payload = { ...formData, quantity: Number(formData.quantity), price: Number(formData.price) };
    if (selectedItem) {
      dispatch(editInventoryItem({ ...payload, id: selectedItem.id }));
    } else {
      dispatch(addInventoryItem(payload));
    }
    closeDialog();
  };

  const handleDelete = (id) => {
    dispatch(removeInventoryItem(id));
  };

  return (
    <AppShell>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} mb={3}>
        <Box>
          <Typography variant="h4">Inventory Management</Typography>
          <Typography color="text.secondary">Track stock levels and manage warehouse items.</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => openDialog()}>
          Add Item
        </Button>
      </Stack>

      {status === 'loading' && <CircularProgress />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1">Low stock items: {lowStockCount}</Typography>
      </Paper>

      <DataTable
        columns={[
          { field: 'name', headerName: 'Name' },
          { field: 'sku', headerName: 'SKU' },
          { field: 'category', headerName: 'Category' },
          { field: 'quantity', headerName: 'Quantity', align: 'right' },
          { field: 'price', headerName: 'Price', align: 'right', valueGetter: (row) => `$${row.price.toFixed(2)}` }
        ]}
        rows={items}
        getRowClassName={(row) => ({ bgcolor: row.quantity <= 5 ? 'rgba(255, 243, 205, 0.8)' : 'inherit' })}
        renderActions={(row) => (
          <Stack direction="row" spacing={1} justifyContent="center">
            <Button size="small" onClick={() => openDialog(row)} startIcon={<EditIcon />}>
              Edit
            </Button>
            <Button size="small" color="error" onClick={() => handleDelete(row.id)} startIcon={<DeleteIcon />}>
              Delete
            </Button>
          </Stack>
        )}
      />

      <ModalForm
        open={dialogOpen}
        title={selectedItem ? 'Edit Inventory Item' : 'Add Inventory Item'}
        onClose={closeDialog}
        onSave={handleSave}
      >
        <TextField label="Name" name="name" value={formData.name} onChange={handleChange} />
        <TextField label="SKU" name="sku" value={formData.sku} onChange={handleChange} />
        <TextField label="Category" name="category" value={formData.category} onChange={handleChange} />
        <TextField label="Quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} />
        <TextField label="Price" name="price" type="number" value={formData.price} onChange={handleChange} />
      </ModalForm>
    </AppShell>
  );
}

export default InventoryPage;
