import { useT } from '@/shared/i18n/useT'
import { LoadingState } from '@/shared/ui/LoadingState'

/** Shown while a lazily loaded route's code is downloading on a cold start. */
export function AppLoading() {
  const t = useT()
  return <LoadingState label={t.loadingUsers} className="p-6" />
}
