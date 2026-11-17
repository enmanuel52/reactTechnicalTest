import { CheckIcon } from './icons'

interface Option<T extends string> {
  value: T
  label: string
  /** Accessible name when it differs from the visible label (e.g. "Español" for "ES"). */
  ariaLabel?: string
  lang?: string
}

interface SegmentedControlProps<T extends string> {
  label: string
  options: readonly Option<T>[]
  value: T
  onChange: (value: T) => void
}

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex h-10 overflow-hidden rounded-full border border-outline"
    >
      {options.map((option) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            lang={option.lang}
            aria-label={option.ariaLabel}
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={`inline-flex min-w-16 cursor-pointer items-center justify-center gap-1.5 border-outline px-3 text-sm font-medium not-first:border-l focus-visible:-outline-offset-3 ${
              selected
                ? 'bg-secondary-container text-on-secondary-container'
                : 'text-on-surface hover:bg-on-surface/8'
            }`}
          >
            {selected && <CheckIcon size={18} />}
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
