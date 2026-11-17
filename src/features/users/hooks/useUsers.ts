import { useInfiniteQuery, type InfiniteData } from '@tanstack/react-query'
import { getNextPageParam, type Page } from '@/shared/api/http'
import { fetchUsersPage } from '../api'
import { usersKeys } from '../queryKeys'
import type { User } from '../types'

// Defined at module level so `select` keeps a stable identity between renders.
function selectUsers(data: InfiniteData<Page<User>, number>) {
  return { users: data.pages.flatMap((page) => page.items), total: data.pages[0]?.total ?? 0 }
}

export function useUsers() {
  return useInfiniteQuery({
    queryKey: usersKeys.list(),
    queryFn: ({ pageParam, signal }) => fetchUsersPage(pageParam, signal),
    initialPageParam: 1,
    getNextPageParam,
    select: selectUsers,
  })
}
