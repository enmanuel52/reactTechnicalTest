import { LinearProgress } from './LinearProgress'

/** Progress bar plus a label, announced to screen readers via role="status". */
export function LoadingState({ label, className = '' }: { label: string; className?: string }) {
  return (
    <div role="status" className={`flex flex-col gap-4 ${className}`}>
      <LinearProgress />
      <p className="text-on-surface-variant">{label}</p>
    </div>
  )
}
