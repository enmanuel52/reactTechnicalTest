import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { fetchUsers } from '../api'
import { usersKeys } from '../queryKeys'

/** Users whose name contains `query` (all users when empty), loaded in one request. */
export function useUsers(query = '') {
  return useQuery({
    queryKey: usersKeys.list(query),
    queryFn: ({ signal }) => fetchUsers(query, signal),
    // Keep showing the previous results while a new search loads, instead of flashing a spinner.
    placeholderData: keepPreviousData,
  })
}
