import { useQuery } from '@tanstack/react-query'
import { fetchPosts } from '../api'
import { postsKeys } from '../queryKeys'
import type { ApiPost, PostView } from '../types'

// Defined at module level so `select` keeps a stable identity between renders.
function toViews(posts: ApiPost[]): PostView[] {
  return posts.map((post) => ({
    key: `api-${post.id}`,
    title: post.title,
    body: post.body,
    isNew: false,
  }))
}

/** A user's posts from the API, loaded in one request. */
export function useUserPosts(userId: number) {
  return useQuery({
    queryKey: postsKeys.byUser(userId),
    queryFn: ({ signal }) => fetchPosts(userId, signal),
    select: toViews,
  })
}
