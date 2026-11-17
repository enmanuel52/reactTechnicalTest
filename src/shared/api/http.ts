export const API_BASE_URL = 'https://jsonplaceholder.typicode.com'
export const PAGE_SIZE = 10

export class HttpError extends Error {
  readonly status: number

  constructor(status: number, statusText = '') {
    super(`Request failed with status ${status}${statusText ? ` (${statusText})` : ''}`)
    this.name = 'HttpError'
    this.status = status
  }
}

type QueryParams = Record<string, string | number | undefined>

interface RequestOptions {
  params?: QueryParams
  signal?: AbortSignal
}

function buildUrl(path: string, params: QueryParams = {}) {
  const url = new URL(path, API_BASE_URL)
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') url.searchParams.set(key, String(value))
  }
  return url
}

async function request(url: URL, init?: RequestInit) {
  const response = await fetch(url, init)
  if (!response.ok) throw new HttpError(response.status, response.statusText)
  return response
}

export async function getJson<T>(path: string, { params, signal }: RequestOptions = {}) {
  const response = await request(buildUrl(path, params), { signal })
  return (await response.json()) as T
}

export interface Page<T> {
  items: T[]
  /** 1-based page number. */
  page: number
  /** Total number of items across all pages (from the X-Total-Count header). */
  total: number
}

/** Fetches one page of a collection using json-server style `_page` / `_limit`. */
export async function getPage<T>(
  path: string,
  { params, page, signal }: RequestOptions & { page: number },
): Promise<Page<T>> {
  const response = await request(buildUrl(path, { ...params, _page: page, _limit: PAGE_SIZE }), {
    signal,
  })
  const items = (await response.json()) as T[]
  const header = Number(response.headers.get('X-Total-Count'))
  return { items, page, total: Number.isFinite(header) && header > 0 ? header : items.length }
}

/** `getNextPageParam` for TanStack's useInfiniteQuery over `Page<T>` results. */
export function getNextPageParam(lastPage: Page<unknown>, allPages: Page<unknown>[]) {
  const loaded = allPages.reduce((count, page) => count + page.items.length, 0)
  // An empty page means the server has nothing more, whatever the total says.
  if (lastPage.items.length === 0 || loaded >= lastPage.total) return undefined
  return lastPage.page + 1
}
