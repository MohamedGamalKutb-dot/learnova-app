import { QueryClient } from '@tanstack/react-query';
import { APP_CONFIG } from '@/constants/config';

/**
 * Shared TanStack Query client instance.
 * 
 * Default settings:
 * - staleTime: 5 minutes (data is considered fresh for this period)
 * - gcTime: 30 minutes (unused cache entries are garbage collected)
 * - retry: 1 attempt on failure
 * - refetchOnWindowFocus: false (prevents unwanted refetches)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: APP_CONFIG.QUERY_STALE_TIME,
      gcTime: APP_CONFIG.QUERY_CACHE_TIME,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
