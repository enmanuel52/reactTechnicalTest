import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { server } from '@/test/msw/server'
import { API } from '@/test/msw/handlers'
import { getNextPageParam, getPage, HttpError, PAGE_SIZE, type Page } from './http'

const page = (n: number, count: number, total: number): Page<number> => ({
  page: n,
  total,
  items: Array.from({ length: count }, (_, i) => i),
})

describe('getPage', () => {
  it('requests the page with the page size and reads the total from X-Total-Count', async () => {
    let requested: URL | undefined
    server.use(
      http.get(`${API}/things`, ({ request }) => {
        requested = new URL(request.url)
        return HttpResponse.json([{ id: 1 }], { headers: { 'X-Total-Count': '42' } })
      }),
    )

    const result = await getPage<{ id: number }>('/things', { page: 3, params: { userId: 7 } })

    expect(requested?.searchParams.get('_page')).toBe('3')
    expect(requested?.searchParams.get('_limit')).toBe(String(PAGE_SIZE))
    expect(requested?.searchParams.get('userId')).toBe('7')
    expect(result).toEqual({ items: [{ id: 1 }], page: 3, total: 42 })
  })

  it('falls back to the item count when the total header is missing', async () => {
    server.use(http.get(`${API}/things`, () => HttpResponse.json([1, 2, 3])))
    expect((await getPage('/things', { page: 1 })).total).toBe(3)
  })

  it('throws an HttpError carrying the status for non-2xx responses', async () => {
    server.use(http.get(`${API}/things`, () => new HttpResponse(null, { status: 500 })))
    await expect(getPage('/things', { page: 1 })).rejects.toMatchObject({
      name: 'HttpError',
      status: 500,
    })
    await expect(getPage('/things', { page: 1 })).rejects.toBeInstanceOf(HttpError)
  })
})

describe('getNextPageParam', () => {
  it('returns the next page number while items remain', () => {
    const first = page(1, 10, 25)
    expect(getNextPageParam(first, [first])).toBe(2)
    const second = page(2, 10, 25)
    expect(getNextPageParam(second, [first, second])).toBe(3)
  })

  it('stops once everything is loaded', () => {
    const [a, b, c] = [page(1, 10, 25), page(2, 10, 25), page(3, 5, 25)] as const
    expect(getNextPageParam(c, [a, b, c])).toBeUndefined()
  })

  it('stops on an empty page even if the total claims there is more', () => {
    const first = page(1, 10, 100)
    const empty = page(2, 0, 100)
    expect(getNextPageParam(empty, [first, empty])).toBeUndefined()
  })
})
