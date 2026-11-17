import { getJson, postJson } from '@/shared/api/http'
import type { ApiPost } from './types'

/** All of a user's posts, in one request (JSONPlaceholder has 10 per user). */
export function fetchPosts(userId: number, signal?: AbortSignal) {
  return getJson<ApiPost[]>('/posts', { params: { userId }, signal })
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
