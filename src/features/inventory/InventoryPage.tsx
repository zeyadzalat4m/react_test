import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useItems, useCreateItem, useUpdateItem, useDeleteItem } from '../../hooks/useItems';
import { useAuditLogs } from '../../hooks/useAuditLogs';
import type { Item } from '../../types';

const itemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  sku: z.string().min(1, 'SKU is required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  quantity: z.number().min(0, 'Quantity must be positive'),
  unit_price: z.number().min(0, 'Price must be positive'),
  min_stock_level: z.number().min(0, 'Min stock level must be positive'),
});

type ItemForm = z.infer<typeof itemSchema>;

function InventoryPage() {
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showAuditLogs, setShowAuditLogs] = useState(false);

  const { data: itemsData, isLoading, refetch } = useItems({ search, limit: 50, offset: 0 });
  const createItem = useCreateItem();
  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();
  const { data: auditLogs } = useAuditLogs(selectedItem?.id || '', { limit: 20 });

  const items = itemsData?.data || [];
  console.log('🔍 InventoryPage - Items data:', { itemsData, items, isLoading });
  const filteredItems = items.filter((item: any) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.sku.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ItemForm>({
    resolver: zodResolver(itemSchema),
  });

  const onSubmit = (data: ItemForm) => {
    if (selectedItem) {
      updateItem.mutate({ id: selectedItem.id, item: data }, {
        onSuccess: () => {
          setShowForm(false);
          setSelectedItem(null);
          reset();
          refetch();
        },
      });
    } else {
      createItem.mutate(data, {
        onSuccess: () => {
          setShowForm(false);
          reset();
          refetch();
        },
      });
    }
  };

  const handleEdit = (item: Item) => {
    setSelectedItem(item);
    reset({
      name: item.name,
      sku: item.sku,
      description: item.description || '',
      category: item.category,
      quantity: item.quantity,
      unit_price: item.unit_price,
      min_stock_level: item.min_stock_level,
    });
    setShowForm(true);
  };

  const handleDelete = (item: Item) => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      deleteItem.mutate(item.id, {
        onSuccess: () => {
          refetch();
        },
      });
    }
  };

  const handleViewAuditLogs = (item: Item) => {
    setSelectedItem(item);
    setShowAuditLogs(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="mt-2 text-gray-600">Manage your warehouse items</p>
        </div>
        <button
          onClick={() => {
            setSelectedItem(null);
            reset({
              name: '',
              sku: '',
              description: '',
              category: '',
              quantity: 0,
              unit_price: 0,
              min_stock_level: 0,
            });
            setShowForm(true);
          }}
          className="btn-primary"
        >
          Add Item
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field max-w-md"
        />
      </div>

      {/* Items Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No items found
                  </td>
                </tr>
              ) : (
                filteredItems.map((item: any) => (
                  <tr key={item.id}>
                    <td className="font-medium text-gray-900">{item.name}</td>
                    <td>{item.sku}</td>
                    <td>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {item.category}
                      </span>
                    </td>
                    <td>{item.quantity}</td>
                    <td>${item.unit_price.toFixed(2)}</td>
                    <td>
                      {item.quantity <= item.min_stock_level ? (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleViewAuditLogs(item)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Logs
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Item Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {selectedItem ? 'Edit Item' : 'Add Item'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input {...register('name')} className="input-field" />
                {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">SKU</label>
                <input {...register('sku')} className="input-field" />
                {errors.sku && <p className="text-red-600 text-sm">{errors.sku.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea {...register('description')} className="input-field" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input {...register('category')} className="input-field" />
                {errors.category && <p className="text-red-600 text-sm">{errors.category.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input {...register('quantity', { valueAsNumber: true })} type="number" className="input-field" />
                  {errors.quantity && <p className="text-red-600 text-sm">{errors.quantity.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Unit Price</label>
                  <input {...register('unit_price', { valueAsNumber: true })} type="number" step="0.01" className="input-field" />
                  {errors.unit_price && <p className="text-red-600 text-sm">{errors.unit_price.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Min Stock Level</label>
                <input {...register('min_stock_level', { valueAsNumber: true })} type="number" className="input-field" />
                {errors.min_stock_level && <p className="text-red-600 text-sm">{errors.min_stock_level.message}</p>}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createItem.isPending || updateItem.isPending}
                  className="btn-primary"
                >
                  {createItem.isPending || updateItem.isPending ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Audit Logs Modal */}
      {showAuditLogs && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Audit Logs for {selectedItem.name}</h2>
              <button
                onClick={() => setShowAuditLogs(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              {auditLogs?.data?.length ? (
                auditLogs.data.map((log: any) => (
                  <div key={log.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{log.action}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(log.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {log.old_values && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Old values:</p>
                        <pre className="text-xs bg-gray-100 p-2 rounded mt-1">
                          {JSON.stringify(log.old_values, null, 2)}
                        </pre>
                      </div>
                    )}
                    {log.new_values && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">New values:</p>
                        <pre className="text-xs bg-gray-100 p-2 rounded mt-1">
                          {JSON.stringify(log.new_values, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No audit logs found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InventoryPage;