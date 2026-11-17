import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, type RenderOptions } from '@testing-library/react'
import type { ReactElement } from 'react'
import { createMemoryRouter, MemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from '@/app/router'

/** No retries or caching between tests, so errors surface immediately. */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity }, mutations: { retry: false } },
  })
}

/** Renders a single component with query + router context. */
export function renderWithProviders(
  ui: ReactElement,
  { route = '/', ...options }: { route?: string } & Omit<RenderOptions, 'wrapper'> = {},
) {
  const queryClient = createTestQueryClient()
  return {
    queryClient,
    ...render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </QueryClientProvider>,
      options,
    ),
  }
}

/** Renders the real route tree (layout, panes, pages) at the given URL. */
export function renderApp({ route = '/' }: { route?: string } = {}) {
  const queryClient = createTestQueryClient()
  const router = createMemoryRouter(routes, { initialEntries: [route] })
  return {
    router,
    queryClient,
    ...render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    ),
  }
}
