import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'

/**
 * Search box state. `input` updates on every keystroke; `query` is the trimmed,
 * debounced value that drives the request and is mirrored to the `?q=` URL
 * param, so a search can be shared and survives selecting a user.
 */
export function useUserSearch() {
  const [searchParams, setSearchParams] = useSearchParams()
  const urlQuery = searchParams.get('q') ?? ''
  const [input, setInput] = useState(urlQuery)
  const query = useDebouncedValue(input.trim())

  useEffect(() => {
    if (query === urlQuery) return
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous)
        if (query) next.set('q', query)
        else next.delete('q')
        return next
      },
      { replace: true },
    )
  }, [query, urlQuery, setSearchParams])

  const clear = useCallback(() => setInput(''), [])

  return { input, setInput, query, clear }
}
