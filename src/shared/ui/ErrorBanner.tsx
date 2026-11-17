import { Button } from './Button'

interface ErrorBannerProps {
  title: string
  body: string
  retryLabel: string
  onRetry: () => void
}

/** Compact error that stays inside its own panel while the rest of the page keeps working. */
export function ErrorBanner({ title, body, retryLabel, onRetry }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className="mt-2 flex flex-wrap items-center gap-4 rounded-xl bg-error-container p-4 text-on-error-container"
    >
      <div className="min-w-50 flex-1">
        <p className="font-medium">{title}</p>
        <p>{body}</p>
      </div>
      <Button
        variant="text"
        onClick={onRetry}
        className="text-on-error-container hover:bg-on-error-container/8"
      >
        {retryLabel}
      </Button>
    </div>
  )
}
