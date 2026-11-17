export const API_BASE_URL = 'https://jsonplaceholder.typicode.com'

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

export async function postJson<TResponse>(
  path: string,
  body: unknown,
  { signal }: Pick<RequestOptions, 'signal'> = {},
) {
  const response = await request(buildUrl(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify(body),
    signal,
  })
  return (await response.json()) as TResponse
}
