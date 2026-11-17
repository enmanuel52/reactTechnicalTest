import { useCallback } from 'react'
import { useT } from '@/shared/i18n/useT'
import { ErrorState } from '@/shared/ui/ErrorState'
import { LoadMore } from '@/shared/ui/LoadMore'
import { LinearProgress } from '@/shared/ui/LinearProgress'
import { LoadingState } from '@/shared/ui/LoadingState'
import { useUsers } from '../hooks/useUsers'
import { useUserSearch } from '../hooks/useUserSearch'
import { NoResults } from './NoResults'
import { SearchBar } from './SearchBar'
import { UserListItem } from './UserListItem'

export function UsersPane() {
  const t = useT()
  const { input, setInput, query, clear } = useUserSearch()
  const {
    data,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    isPlaceholderData,
  } = useUsers(query)
  // Stable identity so the infinite-scroll observer isn't re-created on every render.
  const loadMore = useCallback(() => void fetchNextPage(), [fetchNextPage])

  return (
    <section
      aria-labelledby="users-heading"
      className="flex flex-col gap-2 rounded-2xl bg-surface-low p-3"
    >
      <SearchBar value={input} onChange={setInput} onClear={clear} />

      <div className="flex items-baseline justify-between px-4 pt-3 pb-1">
        <h1 id="users-heading" className="text-sm font-medium text-primary">
          {t.users}
        </h1>
        <span aria-live="polite" className="text-xs text-on-surface-variant">
          {data ? t.usersCount(data.total) : ''}
        </span>
      </div>

      <div className="max-h-[calc(100vh-14rem)] min-h-80 overflow-y-auto">
        {isPending ? (
          <LoadingState label={t.loadingUsers} className="p-4" />
        ) : isError && !data ? (
          <ErrorState
            title={t.usersErrorTitle}
            body={t.errorBody}
            retryLabel={t.retry}
            onRetry={() => void refetch()}
          />
        ) : (
          <>
            {isPlaceholderData && <LinearProgress />}
            <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
              {data?.users.map((user) => (
                <UserListItem key={user.id} user={user} />
              ))}
            </ul>
            {!isPlaceholderData && query && data?.users.length === 0 && (
              <NoResults query={query} onClear={clear} />
            )}
            <LoadMore
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              isError={isFetchNextPageError}
              onLoadMore={loadMore}
              mode="button"
            />
          </>
        )}
      </div>
    </section>
  )
}
