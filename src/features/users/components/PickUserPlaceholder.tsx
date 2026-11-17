import { useT } from '@/shared/i18n/useT'
import { EmptyState } from '@/shared/ui/EmptyState'
import { UsersIcon } from '@/shared/ui/icons'

/** Shown in the detail pane until a user is selected. */
export function PickUserPlaceholder() {
  const t = useT()
  return (
    <EmptyState
      icon={<UsersIcon size={48} className="text-on-surface-variant" />}
      title={t.pickUserTitle}
      body={t.pickUserBody}
    />
  )
}
