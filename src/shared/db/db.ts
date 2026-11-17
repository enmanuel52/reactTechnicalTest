import Dexie, { type EntityTable } from 'dexie'

/** A post written by the user. JSONPlaceholder doesn't persist writes, so we do. */
export interface LocalPost {
  id: number
  userId: number
  title: string
  body: string
  /** Epoch ms; newest posts are listed first. */
  createdAt: number
}

class AppDatabase extends Dexie {
  posts!: EntityTable<LocalPost, 'id'>

  constructor() {
    super('the-social-network')
    // `++id` auto-increments; `userId` is indexed to load one user's posts.
    this.version(1).stores({ posts: '++id, userId, createdAt' })
  }
}

export const db = new AppDatabase()
