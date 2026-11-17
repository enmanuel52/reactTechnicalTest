import { useEffect } from 'react'
import { useToastStore } from '@/shared/store/toast'

const AUTO_HIDE_MS = 4000

/** Single live region for transient confirmations; mounted once in the layout. */
export function Snackbar() {
  const toast = useToastStore((s) => s.toast)
  const hide = useToastStore((s) => s.hide)

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(hide, AUTO_HIDE_MS)
    return () => clearTimeout(timer)
  }, [toast, hide])

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed right-4 bottom-6 left-4 z-20 md:right-auto md:left-6"
    >
      {toast && (
        <div className="min-w-72 rounded-sm bg-inverse-surface px-4 py-3.5 text-inverse-on-surface shadow-[0_2px_6px_2px_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.3)]">
          {toast.message}
        </div>
      )}
    </div>
  )
}
