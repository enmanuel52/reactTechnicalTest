import { http, HttpResponse, type RequestHandler } from 'msw'
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

/** Handler serving `count` users; override per test with `server.use(...)`. */
export function usersHandler(count = 10) {
  const users = makeUsers(count)
  return http.get(`${API}/users`, ({ request }) => paginated(users, new URL(request.url)))
}

/** Default handlers; feature tests add or override their own with `server.use(...)`. */
export const handlers: RequestHandler[] = [usersHandler(10)]
