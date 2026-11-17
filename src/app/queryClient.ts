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
        // By default TanStack pauses requests while offline, which would leave the UI
        // on a spinner forever. Fail fast instead so the error state and Retry show up
        // (and IndexedDB reads, which need no network, are never paused).
        networkMode: 'always',
      },
      mutations: { networkMode: 'always' },
    },
  })
}
