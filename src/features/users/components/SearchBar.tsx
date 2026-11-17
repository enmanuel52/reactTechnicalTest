import { useT } from '@/shared/i18n/useT'
import { CloseIcon, SearchIcon } from '@/shared/ui/icons'
import { IconButton } from '@/shared/ui/IconButton'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
}

export function SearchBar({ value, onChange, onClear }: SearchBarProps) {
  const t = useT()
  return (
    <div className="flex h-14 items-center gap-4 rounded-full bg-surface-high pr-1 pl-4 text-on-surface-variant focus-within:shadow-[inset_0_0_0_2px_var(--md-primary)]">
      <SearchIcon className="shrink-0" />
      <label htmlFor="user-search" className="sr-only">
        {t.searchLabel}
      </label>
      <input
        id="user-search"
        type="search"
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={t.searchPlaceholder}
        className="h-full min-w-0 flex-1 bg-transparent text-base text-on-surface outline-none placeholder:text-on-surface-variant [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value && (
        <IconButton label={t.clearSearch} onClick={onClear}>
          <CloseIcon />
        </IconButton>
      )}
    </div>
  )
}
