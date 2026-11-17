import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  body?: string
  icon?: ReactNode
  children?: ReactNode
}

/** Centered message for "nothing selected", "not found" and similar screens. */
export function EmptyState({ title, body, icon, children }: EmptyStateProps) {
  return (
    <div className="flex min-h-120 flex-col items-center justify-center gap-2 p-10 text-center">
      {icon}
      <h2 className={`text-[22px] leading-7 font-normal ${icon ? 'mt-4' : ''}`}>{title}</h2>
      {body && <p className="max-w-85 text-on-surface-variant">{body}</p>}
      {children}
    </div>
  )
}
