import { useT } from '@/shared/i18n/useT'
import { Button } from '@/shared/ui/Button'

export function NoResults({ query, onClear }: { query: string; onClear: () => void }) {
  const t = useT()
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
      <p className="text-base leading-6">{t.noResults(query)}</p>
      <p className="text-on-surface-variant">{t.noResultsHint}</p>
      <Button variant="text" onClick={onClear} className="mt-2">
        {t.clearSearch}
      </Button>
    </div>
  )
}
