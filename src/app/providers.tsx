import { QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { createQueryClient } from './queryClient'

export function AppProviders({ children }: { children: ReactNode }) {
  // Lazy initialiser: one client per app mount, never re-created on re-render.
  const [queryClient] = useState(createQueryClient)
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
