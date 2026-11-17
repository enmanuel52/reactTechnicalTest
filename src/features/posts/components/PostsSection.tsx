import { useCallback } from 'react'
import { useT } from '@/shared/i18n/useT'
import { ErrorBanner } from '@/shared/ui/ErrorBanner'
import { LoadMore } from '@/shared/ui/LoadMore'
import { LoadingState } from '@/shared/ui/LoadingState'
import { useUserPosts } from '../hooks/useUserPosts'
import { PostItem } from './PostItem'

export function PostsSection({ userId }: { userId: number }) {
  const t = useT()
  const {
    data,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useUserPosts(userId)
  const loadMore = useCallback(() => void fetchNextPage(), [fetchNextPage])

  return (
    <section aria-labelledby="posts-heading" className="flex flex-col">
      <div className="flex items-baseline justify-between pb-2">
        <h3 id="posts-heading" className="text-sm font-medium text-primary">
          {t.posts}
        </h3>
        <span aria-live="polite" className="text-xs text-on-surface-variant">
          {data ? t.postsCount(data.total) : ''}
        </span>
      </div>

      {isPending ? (
        <LoadingState label={t.loadingPosts} className="py-4" />
      ) : isError && !data ? (
        <ErrorBanner
          title={t.postsErrorTitle}
          body={t.errorBody}
          retryLabel={t.retry}
          onRetry={() => void refetch()}
        />
      ) : data.posts.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-base leading-6">{t.noPostsTitle}</p>
          <p className="text-on-surface-variant">{t.noPostsBody}</p>
        </div>
      ) : (
        <>
          <ul className="m-0 list-none p-0">
            {data.posts.map((post) => (
              <PostItem key={post.key} post={post} />
            ))}
          </ul>
          <LoadMore
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            isError={isFetchNextPageError}
            onLoadMore={loadMore}
          />
        </>
      )}
    </section>
  )
}
