import { useT } from '@/shared/i18n/useT'
import { ButtonLink } from '@/shared/ui/ButtonLink'

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
      <ButtonLink to="/" reloadDocument className="mt-4">
        {t.goHome}
      </ButtonLink>
    </div>
  )
}
