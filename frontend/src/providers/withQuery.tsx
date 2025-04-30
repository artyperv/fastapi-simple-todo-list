import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { FC } from "react";

// QueryClient init
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export const withQuery = (Component: FC) => () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Component />
    </QueryClientProvider>
  );
};

export { queryClient };
