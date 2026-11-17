import { getJson } from '@/shared/api/http'
import type { User } from './types'
import { escapeRegex } from './utils/escapeRegex'

/**
 * All users, in one request: JSONPlaceholder only has 10, so pagination would add
 * requests and UI without any benefit. `query` is matched against the name on the
 * server (case-insensitive); it is a regex there, hence the escaping.
 */
export function fetchUsers(query: string, signal?: AbortSignal) {
  return getJson<User[]>('/users', {
    params: { name_like: query ? escapeRegex(query) : undefined },
    signal,
  })
}

export function fetchUser(id: number, signal?: AbortSignal) {
  return getJson<User>(`/users/${id}`, { signal })
}
