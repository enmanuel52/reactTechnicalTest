import { Link } from 'react-router-dom'
import { useT } from '@/shared/i18n/useT'

/** Route-level `errorElement`: catches render errors so the app never white-screens. */
export function RouteError() {
  const t = useT()
  return (
    <div
      role="alert"
      className="flex min-h-screen flex-col items-center justify-center gap-2 p-10 text-center"
    >
      <h1 className="text-[22px] leading-7 font-normal">{t.unexpectedErrorTitle}</h1>
      <p className="text-on-surface-variant">{t.errorBody}</p>
      <Link
        to="/"
        reloadDocument
        className="mt-4 rounded-full px-3 py-2.5 font-medium text-primary hover:bg-primary/8"
      >
        {t.goHome}
      </Link>
    </div>
  )
}
