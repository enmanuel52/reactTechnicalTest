/** A post as returned by JSONPlaceholder. */
export interface ApiPost {
  id: number
  userId: number
  title: string
  body: string
}

/** What the UI renders: API posts and locally created ones share this shape. */
export interface PostView {
  /** Unique across both sources, e.g. "api-3" or "local-12". */
  key: string
  title: string
  body: string
  isNew: boolean
}
