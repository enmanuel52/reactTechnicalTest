import { useQuery } from '@tanstack/react-query'
import type { LocalPost } from '@/shared/db/db'
import { listLocalPosts } from '../localPosts'
import { postsKeys } from '../queryKeys'
import type { PostView } from '../types'

function toViews(posts: LocalPost[]): PostView[] {
  return posts.map((post) => ({
    key: `local-${post.id}`,
    title: post.title,
    body: post.body,
    isNew: true,
  }))
}

/** Posts this user wrote in the app (stored in IndexedDB), newest first. */
export function useLocalPosts(userId: number) {
  return useQuery({
    queryKey: postsKeys.localByUser(userId),
    queryFn: () => listLocalPosts(userId),
    select: toViews,
  })
}
