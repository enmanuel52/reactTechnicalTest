import { Outlet, useMatch } from 'react-router-dom'
import { UsersPane } from '@/features/users/components/UsersPane'
import { useApplyPreferences } from '@/shared/store/preferences'
import { AppHeader } from './AppHeader'

/**
 * Two panes on desktop (users | detail). Below the `md` breakpoint only one is
 * visible, chosen by the route: `/` shows the list, `/users/:id` the detail.
 */
export function RootLayout() {
  useApplyPreferences()
  const isDetail = useMatch('/users/:userId') !== null

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <AppHeader />
      <main className="mx-auto flex max-w-7xl items-start gap-6 px-4 pt-2 pb-24 md:px-6">
        <div className={`${isDetail ? 'hidden' : 'block'} w-full md:block md:w-90 md:shrink-0`}>
          <UsersPane />
        </div>
        <div className={`${isDetail ? 'block' : 'hidden'} min-w-0 flex-1 md:block`}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
