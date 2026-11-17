import { db, type LocalPost } from '@/shared/db/db'
import type { PostInput } from './schema'

/** A user's locally saved posts, newest first. */
export async function listLocalPosts(userId: number) {
  const posts = await db.posts.where('userId').equals(userId).toArray()
  // `id` breaks ties between posts created within the same millisecond.
  return posts.sort((a, b) => b.createdAt - a.createdAt || b.id - a.id)
}

export async function addLocalPost(userId: number, input: PostInput): Promise<LocalPost> {
  const post = { userId, ...input, createdAt: Date.now() }
  const id = await db.posts.add(post as LocalPost)
  return { ...post, id }
}
