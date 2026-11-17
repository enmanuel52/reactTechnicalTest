import { Button } from './Button'
import { ErrorCircleIcon } from './icons'

interface ErrorStateProps {
  title: string
  body: string
  retryLabel: string
  onRetry: () => void
}

/** Centered "what happened / what to do" panel with a retry action. */
export function ErrorState({ title, body, retryLabel, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-center gap-2 px-6 py-12 text-center">
      <ErrorCircleIcon size={32} className="text-error" />
      <h2 className="mt-2 text-base leading-6 font-medium">{title}</h2>
      <p className="text-on-surface-variant">{body}</p>
      <Button variant="outlined" onClick={onRetry} className="mt-4">
        {retryLabel}
      </Button>
    </div>
  )
}
