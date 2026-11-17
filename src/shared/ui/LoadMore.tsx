import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll'
import { useT } from '@/shared/i18n/useT'
import { Button } from './Button'
import { ExpandMoreIcon } from './icons'
import { IconButton } from './IconButton'
import { LoadingState } from './LoadingState'

interface LoadMoreProps {
  hasNextPage: boolean
  isFetchingNextPage: boolean
  /** True when fetching the *next* page failed (already-loaded items stay visible). */
  isError: boolean
  onLoadMore: () => void
  /**
   * `scroll` (default): loads the next page automatically when the footer scrolls into view.
   * `button`: only loads when the user presses the icon button.
   */
  mode?: 'scroll' | 'button'
}

/**
 * End-of-list footer for paginated lists. In `scroll` mode the footer doubles as
 * an infinite-scroll sentinel and keeps a text button as a fallback (keyboard
 * users, no IntersectionObserver, failed requests). In `button` mode loading is
 * always an explicit action on an icon button.
 */
export function LoadMore({
  hasNextPage,
  isFetchingNextPage,
  isError,
  onLoadMore,
  mode = 'scroll',
}: LoadMoreProps) {
  const t = useT()
  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    enabled: mode === 'scroll' && hasNextPage && !isFetchingNextPage && !isError,
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
      ) : mode === 'button' ? (
        <div className="flex justify-center">
          <IconButton label={t.loadMore} onClick={onLoadMore} className="border border-outline">
            <ExpandMoreIcon />
          </IconButton>
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
