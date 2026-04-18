import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  TextField,
  CircularProgress,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AppShell from '../../components/AppShell.jsx';
import DataTable from '../../components/DataTable.jsx';
import ModalForm from '../../components/ModalForm.jsx';
import { fetchSuppliers, addSupplier, editSupplier, removeSupplier } from './suppliersSlice.js';

const emptySupplier = { name: '', email: '', phone: '', category: '' };

function SuppliersPage() {
  const dispatch = useDispatch();
  const { suppliers, status, error } = useSelector((state) => state.suppliers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState(emptySupplier);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  useEffect(() => {
    dispatch(fetchSuppliers());
  }, [dispatch]);

  const openDialog = (supplier = null) => {
    setSelectedSupplier(supplier);
    setFormData(supplier ? { ...supplier } : emptySupplier);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setSelectedSupplier(null);
    setFormData(emptySupplier);
    setDialogOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (selectedSupplier) {
      dispatch(editSupplier({ ...formData, id: selectedSupplier.id }));
    } else {
      dispatch(addSupplier(formData));
    }
    closeDialog();
  };

  const handleDelete = (id) => {
    dispatch(removeSupplier(id));
  };

  return (
    <AppShell>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} mb={3}>
        <Box>
          <Typography variant="h4">Suppliers</Typography>
          <Typography color="text.secondary">Manage suppliers and contact details.</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => openDialog()}>
          Add Supplier
        </Button>
      </Stack>

      {status === 'loading' && <CircularProgress />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <DataTable
        columns={[
          { field: 'name', headerName: 'Name' },
          { field: 'email', headerName: 'Email' },
          { field: 'phone', headerName: 'Phone' },
          { field: 'category', headerName: 'Category' }
        ]}
        rows={suppliers}
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
        title={selectedSupplier ? 'Edit Supplier' : 'Add Supplier'}
        onClose={closeDialog}
        onSave={handleSave}
      >
        <TextField label="Supplier Name" name="name" value={formData.name} onChange={handleChange} />
        <TextField label="Email" name="email" value={formData.email} onChange={handleChange} />
        <TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
        <TextField label="Category" name="category" value={formData.category} onChange={handleChange} />
      </ModalForm>
    </AppShell>
  );
}

export default SuppliersPage;
