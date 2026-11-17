import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll'
import { useT } from '@/shared/i18n/useT'
import { Button } from './Button'
import { LoadingState } from './LoadingState'

interface LoadMoreProps {
  hasNextPage: boolean
  isFetchingNextPage: boolean
  /** True when fetching the *next* page failed (already-loaded items stay visible). */
  isError: boolean
  onLoadMore: () => void
}

/**
 * End-of-list footer for paginated lists: an invisible sentinel loads the next
 * page automatically when scrolled into view, and a button remains as a
 * fallback (keyboard users, no IntersectionObserver, failed requests).
 */
export function LoadMore({ hasNextPage, isFetchingNextPage, isError, onLoadMore }: LoadMoreProps) {
  const t = useT()
  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    enabled: hasNextPage && !isFetchingNextPage && !isError,
    onLoadMore,
  })

  if (!hasNextPage) return null

  return (
    <div ref={sentinelRef} className="px-4 py-3">
      {isFetchingNextPage ? (
        <LoadingState label={t.loadingMore} />
      ) : isError ? (
        <div role="alert" className="flex items-center justify-between gap-4">
          <p className="text-on-surface-variant">{t.loadMoreError}</p>
          <Button variant="text" onClick={onLoadMore}>
            {t.retry}
          </Button>
        </div>
      ) : (
        <div className="flex justify-center">
          <Button variant="text" onClick={onLoadMore}>
            {t.loadMore}
          </Button>
        </div>
      )}
    </div>
  )
}
