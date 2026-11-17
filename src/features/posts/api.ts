import { getPage, postJson } from '@/shared/api/http'
import type { ApiPost } from './types'

export function fetchPostsPage(userId: number, page: number, signal?: AbortSignal) {
  return getPage<ApiPost>('/posts', { page, params: { userId }, signal })
}

/**
 * JSONPlaceholder accepts the request and answers 201 with the post and a fake
 * id (always 101), but stores nothing. Used to exercise the real network path.
 */
export function createRemotePost(
  post: Pick<ApiPost, 'userId' | 'title' | 'body'>,
  signal?: AbortSignal,
) {
  return postJson<ApiPost>('/posts', post, { signal })
}
