import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchSuppliers as fetchSuppliersApi, createSupplier, updateSupplier, deleteSupplier } from '../../api/apiClient.js';

const initialState = {
  suppliers: [],
  status: 'idle',
  error: null
};

export const fetchSuppliers = createAsyncThunk('suppliers/fetchSuppliers', async (_, { rejectWithValue }) => {
  try {
    return await fetchSuppliersApi();
  } catch (error) {
    return rejectWithValue(error.message || 'Unable to load suppliers');
  }
});

export const addSupplier = createAsyncThunk('suppliers/addSupplier', async (supplier, { rejectWithValue }) => {
  try {
    return await createSupplier(supplier);
  } catch (error) {
    return rejectWithValue(error.message || 'Unable to add supplier');
  }
});

export const editSupplier = createAsyncThunk('suppliers/editSupplier', async (supplier, { rejectWithValue }) => {
  try {
    return await updateSupplier(supplier);
  } catch (error) {
    return rejectWithValue(error.message || 'Unable to update supplier');
  }
});

export const removeSupplier = createAsyncThunk('suppliers/removeSupplier', async (supplierId, { rejectWithValue }) => {
  try {
    await deleteSupplier(supplierId);
    return supplierId;
  } catch (error) {
    return rejectWithValue(error.message || 'Unable to delete supplier');
  }
});

const suppliersSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.suppliers = action.payload;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addSupplier.fulfilled, (state, action) => {
        state.suppliers.unshift(action.payload);
      })
      .addCase(editSupplier.fulfilled, (state, action) => {
        state.suppliers = state.suppliers.map((supplier) =>
          supplier.id === action.payload.id ? action.payload : supplier
        );
      })
      .addCase(removeSupplier.fulfilled, (state, action) => {
        state.suppliers = state.suppliers.filter((supplier) => supplier.id !== action.payload);
      });
  }
});

export default suppliersSlice.reducer;
