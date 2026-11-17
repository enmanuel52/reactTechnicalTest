import { useEffect, useRef } from 'react'

interface UseInfiniteScrollOptions {
  /** Observe only while there is more to load and nothing is in flight. */
  enabled: boolean
  onLoadMore: () => void
  rootMargin?: string
}

/**
 * Calls `onLoadMore` when the returned ref's element scrolls into view.
 * Re-observing after each load also fills the viewport when a page is short.
 */
export function useInfiniteScroll<T extends Element>({
  enabled,
  onLoadMore,
  rootMargin = '200px',
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<T>(null)

  useEffect(() => {
    const node = sentinelRef.current
    if (!enabled || !node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) onLoadMore()
      },
      { rootMargin },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [enabled, onLoadMore, rootMargin])

  return sentinelRef
}
