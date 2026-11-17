import { useT } from '@/shared/i18n/useT'
import { ButtonLink } from '@/shared/ui/ButtonLink'
import { EmptyState } from '@/shared/ui/EmptyState'

export function NotFoundPage() {
  const t = useT()
  return (
    <EmptyState title={t.notFoundTitle} body={t.notFoundBody}>
      <ButtonLink to="/" className="mt-4">
        {t.goHome}
      </ButtonLink>
    </EmptyState>
  )
}
