import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useOrders, useCreateOrder, useCompleteOrder } from '../../hooks/useOrders';
import { useSuppliers } from '../../hooks/useSuppliers';
import { useItems } from '../../hooks/useItems';

const orderSchema = z.object({
  type: z.enum(['incoming', 'outgoing']),
  supplier_id: z.string().optional(),
  items: z.array(z.object({
    item_id: z.string(),
    quantity: z.number().min(1),
    unit_price: z.number().min(0).optional(),
  })).min(1, 'At least one item is required'),
});

type OrderForm = z.infer<typeof orderSchema>;

function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [orderItems, setOrderItems] = useState<Array<{ item_id: string; quantity: number; unit_price: number }>>([]);

  const { data: ordersData, isLoading, refetch } = useOrders({ status: statusFilter || undefined, limit: 50 });
  const { data: suppliersData } = useSuppliers({ limit: 100 });
  const { data: itemsData } = useItems({ limit: 100 });
  const createOrder = useCreateOrder();
  const completeOrder = useCompleteOrder();

  const orders = ordersData?.data || [];
  const suppliers = suppliersData?.data || [];
  const items = itemsData?.data || [];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<OrderForm>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      type: 'incoming',
      items: [],
    },
  });

  const orderType = watch('type');

  const onSubmit = (data: OrderForm) => {
    createOrder.mutate(data, {
      onSuccess: () => {
        setShowForm(false);
        reset();
        setOrderItems([]);
        refetch();
      },
    });
  };

  const handleCompleteOrder = (orderId: string) => {
    completeOrder.mutate(orderId, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const addOrderItem = () => {
    setOrderItems([...orderItems, { item_id: '', quantity: 1, unit_price: 0 }]);
  };

  const updateOrderItem = (index: number, field: string, value: any) => {
    const updated = [...orderItems];
    updated[index] = { ...updated[index], [field]: value };
    setOrderItems(updated);
    setValue('items', updated);
  };

  const removeOrderItem = (index: number) => {
    const updated = orderItems.filter((_, i) => i !== index);
    setOrderItems(updated);
    setValue('items', updated);
  };

  const filteredOrders = orders.filter((order: any) =>
    !statusFilter || order.status === statusFilter
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
          <p className="mt-2 text-gray-600">Manage incoming and outgoing orders</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            reset();
            setOrderItems([]);
          }}
          className="btn-primary"
        >
          Create Order
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field max-w-xs"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Type</th>
                <th>Supplier</th>
                <th>Items</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order: any) => (
                  <tr key={order.id}>
                    <td className="font-medium text-gray-900">#{order.id}</td>
                    <td>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.type === 'incoming'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {order.type}
                      </span>
                    </td>
                    <td>
                      {suppliers.find((s: any) => s.id === order.supplier_id)?.name || 'N/A'}
                    </td>
                    <td>{order.items.length} items</td>
                    <td>${order.total_amount.toFixed(2)}</td>
                    <td>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="flex space-x-2">
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleCompleteOrder(order.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Complete
                          </button>
                        )}
                        <button
                          className="text-gray-600 hover:text-gray-900"
                        >
                          View
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

      {/* Order Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create New Order</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Order Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order Type</label>
                <div className="space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="incoming"
                      {...register('type')}
                      className="mr-2"
                    />
                    Incoming (Receiving items)
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="outgoing"
                      {...register('type')}
                      className="mr-2"
                    />
                    Outgoing (Shipping items)
                  </label>
                </div>
                {errors.type && <p className="text-red-600 text-sm">{errors.type.message}</p>}
              </div>

              {/* Supplier Selection (for incoming orders) */}
              {orderType === 'incoming' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
                  <select {...register('supplier_id')} className="input-field">
                    <option value="">Select a supplier</option>
                    {suppliers.map((supplier: any) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                  {errors.supplier_id && <p className="text-red-600 text-sm">{errors.supplier_id.message}</p>}
                </div>
              )}

              {/* Order Items */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700">Order Items</label>
                  <button
                    type="button"
                    onClick={addOrderItem}
                    className="btn-secondary text-sm"
                  >
                    Add Item
                  </button>
                </div>

                <div className="space-y-3">
                  {orderItems.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="flex-1">
                        <select
                          value={item.item_id}
                          onChange={(e) => updateOrderItem(index, 'item_id', e.target.value)}
                          className="input-field"
                        >
                          <option value="">Select item</option>
                          {items.map((i: any) => (
                            <option key={i.id} value={i.id}>
                              {i.name} (SKU: {i.sku})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-24">
                        <input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          className="input-field"
                          min="1"
                        />
                      </div>
                      <div className="w-32">
                        <input
                          type="number"
                          placeholder="Price"
                          value={item.unit_price}
                          onChange={(e) => updateOrderItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                          className="input-field"
                          step="0.01"
                          min="0"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeOrderItem(index)}
                        className="text-red-600 hover:text-red-900"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                {errors.items && <p className="text-red-600 text-sm">{errors.items.message}</p>}
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
                  disabled={createOrder.isPending}
                  className="btn-primary"
                >
                  {createOrder.isPending ? 'Creating...' : 'Create Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdersPage;