import { Link } from 'react-router-dom'
import { useT } from '@/shared/i18n/useT'

export function NotFoundPage() {
  const t = useT()
  return (
    <div className="flex min-h-120 flex-col items-center justify-center gap-2 p-10 text-center">
      <h2 className="text-[22px] leading-7 font-normal">{t.notFoundTitle}</h2>
      <p className="text-on-surface-variant">{t.notFoundBody}</p>
      <Link
        to="/"
        className="mt-4 rounded-full px-3 py-2.5 font-medium text-primary hover:bg-primary/8"
      >
        {t.goHome}
      </Link>
    </div>
  )
}
