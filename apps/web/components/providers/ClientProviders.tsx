"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { ThemeProvider } from "./ThemeProvider";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  // Setup QueryClient specifically this way to avoid cross-request state leakage in SSR
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 4 * 60 * 1000, // 4 mins (slightly lower than Redis 5m to avoid stampede)
            refetchOnWindowFocus: false, // Prevent aggressive refetching unless necessary
            retry: 1, // Only retry once by default on failure
          },
        },
      }),
  );

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
