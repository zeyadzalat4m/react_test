import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSuppliers, useCreateSupplier, useUpdateSupplier, useDeleteSupplier } from '../../hooks/useSuppliers';
import type { Supplier } from '../../types';

const supplierSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type SupplierForm = z.infer<typeof supplierSchema>;

function SuppliersPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const { data: suppliersData, isLoading, refetch } = useSuppliers({ limit: 50 });
  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();
  const deleteSupplier = useDeleteSupplier();

  const suppliers = suppliersData?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupplierForm>({
    resolver: zodResolver(supplierSchema),
  });

  const onSubmit = (data: SupplierForm) => {
    if (selectedSupplier) {
      updateSupplier.mutate({ id: selectedSupplier.id, supplier: data }, {
        onSuccess: () => {
          setShowForm(false);
          setSelectedSupplier(null);
          reset();
          refetch();
        },
      });
    } else {
      createSupplier.mutate(data, {
        onSuccess: () => {
          setShowForm(false);
          reset();
          refetch();
        },
      });
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    reset({
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone || '',
      address: supplier.address || '',
    });
    setShowForm(true);
  };

  const handleDelete = (supplier: Supplier) => {
    if (window.confirm(`Are you sure you want to delete ${supplier.name}?`)) {
      deleteSupplier.mutate(supplier.id, {
        onSuccess: () => {
          refetch();
        },
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Suppliers Management</h1>
          <p className="mt-2 text-gray-600">Manage your supplier relationships</p>
        </div>
        <button
          onClick={() => {
            setSelectedSupplier(null);
            reset({
              name: '',
              email: '',
              phone: '',
              address: '',
            });
            setShowForm(true);
          }}
          className="btn-primary"
        >
          Add Supplier
        </button>
      </div>

      {/* Suppliers Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  </td>
                </tr>
              ) : suppliers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    No suppliers found
                  </td>
                </tr>
              ) : (
                suppliers.map((supplier: any) => (
                  <tr key={supplier.id}>
                    <td className="font-medium text-gray-900">{supplier.name}</td>
                    <td>{supplier.email}</td>
                    <td>{supplier.phone || 'N/A'}</td>
                    <td>{supplier.address || 'N/A'}</td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(supplier)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(supplier)}
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

      {/* Supplier Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {selectedSupplier ? 'Edit Supplier' : 'Add Supplier'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input {...register('name')} className="input-field" />
                {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input {...register('email')} type="email" className="input-field" />
                {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input {...register('phone')} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea {...register('address')} className="input-field" rows={3} />
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
                  disabled={createSupplier.isPending || updateSupplier.isPending}
                  className="btn-primary"
                >
                  {createSupplier.isPending || updateSupplier.isPending ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuppliersPage;