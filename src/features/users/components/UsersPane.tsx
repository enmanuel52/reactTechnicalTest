import { useT } from '@/shared/i18n/useT'

/** Placeholder; replaced by the real paginated list in feature/users-list. */
export function UsersPane() {
  const t = useT()
  return (
    <section aria-labelledby="users-heading" className="rounded-2xl bg-surface-low p-3">
      <h1 id="users-heading" className="px-4 py-3 text-sm font-medium text-primary">
        {t.users}
      </h1>
    </section>
  )
}
