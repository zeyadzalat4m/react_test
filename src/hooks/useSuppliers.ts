import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { apiClient } from '../api/apiClient';
import type { CreateSupplierRequest, UpdateSupplierRequest } from '../types';

export const useSuppliers = (params?: { limit?: number; offset?: number }) => {
  return useQuery({
    queryKey: ['suppliers', params],
    queryFn: () => apiClient.getSuppliers(params),
  });
};

export const useSupplier = (id: string) => {
  return useQuery({
    queryKey: ['supplier', id],
    queryFn: () => apiClient.getSupplier(id),
    enabled: !!id,
  });
};

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (supplier: CreateSupplierRequest) => apiClient.createSupplier(supplier),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return Array.isArray(query.queryKey) && query.queryKey[0] === 'suppliers';
        },
      });
      toast.success('Supplier created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create supplier');
    },
  });
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, supplier }: { id: string; supplier: UpdateSupplierRequest }) =>
      apiClient.updateSupplier(id, supplier),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return Array.isArray(query.queryKey) && (query.queryKey[0] === 'suppliers' || query.queryKey[0] === 'supplier');
        },
      });
      toast.success('Supplier updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update supplier');
    },
  });
};

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteSupplier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return Array.isArray(query.queryKey) && query.queryKey[0] === 'suppliers';
        },
      });
      toast.success('Supplier deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete supplier');
    },
  });
};