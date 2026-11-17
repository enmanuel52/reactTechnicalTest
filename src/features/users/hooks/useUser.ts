import { useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { fetchUser } from '../api'
import { usersKeys } from '../queryKeys'
import type { User } from '../types'

/** Looks the user up in any already-loaded users list, so selecting one needs no request. */
function findCachedUser(queryClient: QueryClient, id: number) {
  const lists = queryClient.getQueriesData<User[]>({ queryKey: [...usersKeys.all, 'list'] })
  for (const [, users] of lists) {
    const user = users?.find((candidate) => candidate.id === id)
    if (user) return user
  }
  return undefined
}

/**
 * A single user. Seeded from the list cache when possible; otherwise fetched,
 * which is what makes deep links such as /users/7 work on a cold start.
 */
export function useUser(id: number) {
  const queryClient = useQueryClient()
  return useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: ({ signal }) => fetchUser(id, signal),
    initialData: () => findCachedUser(queryClient, id),
  })
}
