"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const tanstackQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 30,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
})

export default function Providers({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={tanstackQueryClient}>{children}</QueryClientProvider>
}
