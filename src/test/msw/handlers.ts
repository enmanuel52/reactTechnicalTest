import { http, HttpResponse, type RequestHandler } from 'msw'
import type { ApiPost } from '@/features/posts/types'
import type { User } from '@/features/users/types'

export const API = 'https://jsonplaceholder.typicode.com'

const REAL_NAMES = [
  'Leanne Graham',
  'Ervin Howell',
  'Clementine Bauch',
  'Patricia Lebsack',
  'Chelsey Dietrich',
  'Mrs. Dennis Schulist',
  'Kurtis Weissnat',
  'Nicholas Runolfsdottir V',
  'Glenna Reichert',
  'Clementina DuBuque',
]

export function makeUser(id: number): User {
  const name = REAL_NAMES[id - 1] ?? `Test User ${id}`
  const username = name.split(' ')[0] ?? 'user'
  return {
    id,
    name,
    username,
    email: `${username.toLowerCase()}@example.com`,
    address: { city: `City ${id}` },
    company: { name: `Company ${id}` },
  }
}

export function makeUsers(count: number) {
  return Array.from({ length: count }, (_, index) => makeUser(index + 1))
}

/** Mimics json-server: `_page` / `_limit` slicing plus the X-Total-Count header. */
export function paginated<T>(items: T[], url: URL) {
  const page = Number(url.searchParams.get('_page') ?? 1)
  const limit = Number(url.searchParams.get('_limit') ?? items.length)
  return HttpResponse.json(items.slice((page - 1) * limit, page * limit), {
    headers: { 'X-Total-Count': String(items.length) },
  })
}

/**
 * Handler serving `count` users; override per test with `server.use(...)`.
 * Like the real API, `name_like` is a case-insensitive regex (invalid ones are a 500).
 */
export function usersHandler(count = 10) {
  const users = makeUsers(count)
  return http.get(`${API}/users`, ({ request }) => {
    const url = new URL(request.url)
    const nameLike = url.searchParams.get('name_like')
    if (!nameLike) return paginated(users, url)
    try {
      const pattern = new RegExp(nameLike, 'i')
      return paginated(
        users.filter((user) => pattern.test(user.name)),
        url,
      )
    } catch {
      return new HttpResponse(null, { status: 500 })
    }
  })
}

/** GET /users/:id over the same fixtures; unknown ids are a 404 like the real API. */
export function userByIdHandler(count = 10) {
  const users = makeUsers(count)
  return http.get(`${API}/users/:id`, ({ params }) => {
    const user = users.find((candidate) => candidate.id === Number(params.id))
    return user ? HttpResponse.json(user) : HttpResponse.json({}, { status: 404 })
  })
}

export function makePosts(userId: number, count: number): ApiPost[] {
  return Array.from({ length: count }, (_, index) => ({
    id: (userId - 1) * count + index + 1,
    userId,
    title: `Post ${index + 1} by user ${userId}`,
    body: `Body of post ${index + 1}\nsecond line`,
  }))
}

/** GET /posts?userId=: every user has `perUser` posts. */
export function postsHandler(perUser = 10) {
  return http.get(`${API}/posts`, ({ request }) => {
    const url = new URL(request.url)
    const userId = Number(url.searchParams.get('userId'))
    return paginated(makePosts(userId, perUser), url)
  })
}

/** POST /posts: like the real API, answers 201 with the body and the fake id 101. */
export function createPostHandler() {
  return http.post(`${API}/posts`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    return HttpResponse.json({ ...body, id: 101 }, { status: 201 })
  })
}

/** Default handlers; feature tests add or override their own with `server.use(...)`. */
export const handlers: RequestHandler[] = [
  usersHandler(10),
  userByIdHandler(10),
  postsHandler(10),
  createPostHandler(),
]
