import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { apiClient } from '../api/apiClient';
import type { CreateItemRequest, UpdateItemRequest } from '../types';

export const useItems = (params?: { limit?: number; offset?: number; search?: string; category?: string }) => {
  return useQuery({
    queryKey: ['items', params],
    queryFn: () => apiClient.getItems(params),
  });
};

export const useItem = (id: string) => {
  return useQuery({
    queryKey: ['item', id],
    queryFn: () => apiClient.getItem(id),
    enabled: !!id,
  });
};

export const useCreateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: CreateItemRequest) => apiClient.createItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return Array.isArray(query.queryKey) && query.queryKey[0] === 'items';
        },
      });
      toast.success('Item created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create item');
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, item }: { id: string; item: UpdateItemRequest }) =>
      apiClient.updateItem(id, item),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return Array.isArray(query.queryKey) && (query.queryKey[0] === 'items' || query.queryKey[0] === 'item');
        },
      });
      toast.success('Item updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update item');
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return Array.isArray(query.queryKey) && query.queryKey[0] === 'items';
        },
      });
      toast.success('Item deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete item');
    },
  });
};