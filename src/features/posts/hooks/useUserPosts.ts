import { useInfiniteQuery, type InfiniteData } from '@tanstack/react-query'
import { getNextPageParam, type Page } from '@/shared/api/http'
import { fetchPostsPage } from '../api'
import { postsKeys } from '../queryKeys'
import type { ApiPost, PostView } from '../types'

function toView(post: ApiPost): PostView {
  return { key: `api-${post.id}`, title: post.title, body: post.body, isNew: false }
}

function selectPosts(data: InfiniteData<Page<ApiPost>, number>) {
  return {
    posts: data.pages.flatMap((page) => page.items.map(toView)),
    total: data.pages[0]?.total ?? 0,
  }
}

/** A user's posts, 10 per page, loaded with infinite scroll. */
export function useUserPosts(userId: number) {
  return useInfiniteQuery({
    queryKey: postsKeys.byUser(userId),
    queryFn: ({ pageParam, signal }) => fetchPostsPage(userId, pageParam, signal),
    initialPageParam: 1,
    getNextPageParam,
    select: selectPosts,
  })
}
