import { QueryClient } from '@tanstack/react-query';

/**
 * Centralized React Query client.
 * Sensible defaults: avoid refetching too aggressively, retry transient
 * failures once, and treat data as fresh for a short window to reduce
 * redundant network calls across a Trello/Jira-style board UI.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 30, // 30 seconds
      gcTime: 1000 * 60 * 5, // 5 minutes
    },
    mutations: {
      retry: 0,
    },
  },
});
