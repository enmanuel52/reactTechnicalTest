import { getPage } from '@/shared/api/http'
import type { User } from './types'

export function fetchUsersPage(page: number, signal?: AbortSignal) {
  return getPage<User>('/users', { page, signal })
}
