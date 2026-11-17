import { getJson, getPage } from '@/shared/api/http'
import type { User } from './types'
import { escapeRegex } from './utils/escapeRegex'

/** `query` is matched against the user's name on the server (case-insensitive). */
export function fetchUsersPage(page: number, query: string, signal?: AbortSignal) {
  return getPage<User>('/users', {
    page,
    params: { name_like: query ? escapeRegex(query) : undefined },
    signal,
  })
}

export function fetchUser(id: number, signal?: AbortSignal) {
  return getJson<User>(`/users/${id}`, { signal })
}
