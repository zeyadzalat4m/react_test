import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { apiClient } from '../api/apiClient';
import type { CreateOrderRequest } from '../types';

export const useOrders = (params?: { limit?: number; offset?: number; status?: string }) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => apiClient.getOrders(params),
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => apiClient.getOrder(id),
    enabled: !!id,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (order: CreateOrderRequest) => apiClient.createOrder(order),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return Array.isArray(query.queryKey) && (query.queryKey[0] === 'orders' || query.queryKey[0] === 'items');
        },
      });
      toast.success('Order created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create order');
    },
  });
};

export const useCompleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.completeOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return Array.isArray(query.queryKey) && (query.queryKey[0] === 'orders' || query.queryKey[0] === 'order' || query.queryKey[0] === 'items');
        },
      });
      toast.success('Order completed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to complete order');
    },
  });
};