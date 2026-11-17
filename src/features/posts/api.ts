import { getPage } from '@/shared/api/http'
import type { ApiPost } from './types'

export function fetchPostsPage(userId: number, page: number, signal?: AbortSignal) {
  return getPage<ApiPost>('/posts', { page, params: { userId }, signal })
}
