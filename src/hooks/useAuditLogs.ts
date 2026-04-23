import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/apiClient';

export const useAuditLogs = (itemId: string, params?: { limit?: number; offset?: number }) => {
  return useQuery({
    queryKey: ['auditLogs', itemId, params],
    queryFn: () => apiClient.getAuditLogs(itemId, params),
    enabled: !!itemId,
  });
};