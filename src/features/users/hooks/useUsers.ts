import { keepPreviousData, useInfiniteQuery, type InfiniteData } from '@tanstack/react-query'
import { getNextPageParam, type Page } from '@/shared/api/http'
import { fetchUsersPage } from '../api'
import { usersKeys } from '../queryKeys'
import type { User } from '../types'

// Defined at module level so `select` keeps a stable identity between renders.
function selectUsers(data: InfiniteData<Page<User>, number>) {
  return { users: data.pages.flatMap((page) => page.items), total: data.pages[0]?.total ?? 0 }
}

/** Users whose name contains `query` (all users when empty), 10 per page. */
export function useUsers(query = '') {
  return useInfiniteQuery({
    queryKey: usersKeys.list(query),
    queryFn: ({ pageParam, signal }) => fetchUsersPage(pageParam, query, signal),
    initialPageParam: 1,
    getNextPageParam,
    select: selectUsers,
    // Keep showing the previous results while a new search loads, instead of flashing a spinner.
    placeholderData: keepPreviousData,
  })
}
