import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchInventory as fetchItemsApi, createInventoryItem, updateInventoryItem, deleteInventoryItem } from '../../api/apiClient.js';

const initialState = {
  items: [],
  status: 'idle',
  error: null
};

export const fetchInventory = createAsyncThunk('inventory/fetchInventory', async (_, { rejectWithValue }) => {
  try {
    return await fetchItemsApi();
  } catch (error) {
    return rejectWithValue(error.message || 'Unable to load inventory');
  }
});

export const addInventoryItem = createAsyncThunk('inventory/addInventoryItem', async (item, { rejectWithValue }) => {
  try {
    return await createInventoryItem(item);
  } catch (error) {
    return rejectWithValue(error.message || 'Unable to add item');
  }
});

export const editInventoryItem = createAsyncThunk('inventory/editInventoryItem', async (item, { rejectWithValue }) => {
  try {
    return await updateInventoryItem(item);
  } catch (error) {
    return rejectWithValue(error.message || 'Unable to update item');
  }
});

export const removeInventoryItem = createAsyncThunk('inventory/removeInventoryItem', async (itemId, { rejectWithValue }) => {
  try {
    await deleteInventoryItem(itemId);
    return itemId;
  } catch (error) {
    return rejectWithValue(error.message || 'Unable to remove item');
  }
});

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addInventoryItem.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(editInventoryItem.fulfilled, (state, action) => {
        state.items = state.items.map((item) => (item.id === action.payload.id ? action.payload : item));
      })
      .addCase(removeInventoryItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  }
});

export default inventorySlice.reducer;
