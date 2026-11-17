import { UsersIcon } from '@/shared/ui/icons'
import { useT } from '@/shared/i18n/useT'

/** Shown in the detail pane until a user is selected. */
export function PickUserPlaceholder() {
  const t = useT()
  return (
    <div className="flex min-h-120 flex-col items-center justify-center gap-2 p-10 text-center">
      <UsersIcon size={48} className="text-on-surface-variant" />
      <h2 className="mt-4 text-[22px] leading-7 font-normal">{t.pickUserTitle}</h2>
      <p className="max-w-85 text-on-surface-variant">{t.pickUserBody}</p>
    </div>
  )
}
