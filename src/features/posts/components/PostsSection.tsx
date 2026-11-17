import { useT } from '@/shared/i18n/useT'
import { ErrorBanner } from '@/shared/ui/ErrorBanner'
import { LoadingState } from '@/shared/ui/LoadingState'
import { useLocalPosts } from '../hooks/useLocalPosts'
import { useUserPosts } from '../hooks/useUserPosts'
import { PostItem } from './PostItem'

/**
 * Posts written in the app (saved locally) are pinned above the API's posts.
 * They show even while the API is loading or has failed, since they come from
 * a different source.
 */
export function PostsSection({ userId }: { userId: number }) {
  const t = useT()
  const local = useLocalPosts(userId)
  const { data: api, isPending, isError, refetch } = useUserPosts(userId)

  const posts = [...(local.data ?? []), ...(api ?? [])]
  // Only call the list empty once both sources have answered.
  const isEmpty = api !== undefined && local.data !== undefined && posts.length === 0

  return (
    <section aria-labelledby="posts-heading" className="flex flex-col">
      <div className="flex items-baseline justify-between pb-2">
        <h3 id="posts-heading" className="text-sm font-medium text-primary">
          {t.posts}
        </h3>
        <span aria-live="polite" className="text-xs text-on-surface-variant">
          {api ? t.postsCount(posts.length) : ''}
        </span>
      </div>

      {posts.length > 0 && (
        <ul className="m-0 list-none p-0">
          {posts.map((post) => (
            <PostItem key={post.key} post={post} />
          ))}
        </ul>
      )}

      {isPending ? (
        <LoadingState label={t.loadingPosts} className="py-4" />
      ) : isError && !api ? (
        <ErrorBanner
          title={t.postsErrorTitle}
          body={t.errorBody}
          retryLabel={t.retry}
          onRetry={() => void refetch()}
        />
      ) : (
        isEmpty && (
          <div className="py-8 text-center">
            <p className="text-base leading-6">{t.noPostsTitle}</p>
            <p className="text-on-surface-variant">{t.noPostsBody}</p>
          </div>
        )
      )}
    </section>
  )
}
