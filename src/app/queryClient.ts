import { QueryClient } from '@tanstack/react-query'
import { HttpError } from '@/shared/api/http'

/** Retry once for network/5xx failures; a 4xx will not succeed on a second try. */
export function shouldRetry(failureCount: number, error: unknown) {
  if (error instanceof HttpError && error.status >= 400 && error.status < 500) return false
  return failureCount < 1
}

/** Factory so tests can build an isolated client with their own defaults. */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // JSONPlaceholder data is static, so cached results stay fresh for a while.
        staleTime: 5 * 60 * 1000,
        retry: shouldRetry,
        refetchOnWindowFocus: false,
      },
    },
  })
}
