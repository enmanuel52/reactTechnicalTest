import { QueryClient } from '@tanstack/react-query'

/** Factory so tests can build an isolated client with their own defaults. */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // JSONPlaceholder data is static, so cached results stay fresh for a while.
        staleTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  })
}
