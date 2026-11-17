import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import { UserDetailPage } from '@/features/users/components/UserDetailPage'
import { PickUserPlaceholder } from '@/features/users/components/PickUserPlaceholder'
import { NotFoundPage } from './NotFoundPage'
import { RootLayout } from './RootLayout'
import { RouteError } from './RouteError'

/** Exported separately so tests can mount the same tree in a memory router. */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <PickUserPlaceholder /> },
      { path: 'users/:userId', element: <UserDetailPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]

export const router = createBrowserRouter(routes)
