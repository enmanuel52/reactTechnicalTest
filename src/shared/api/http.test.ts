import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { API } from '@/test/msw/handlers'
import { server } from '@/test/msw/server'
import { getJson, HttpError, postJson } from './http'

describe('getJson', () => {
  it('builds the URL from the path and params, skipping empty values', async () => {
    let requested: URL | undefined
    server.use(
      http.get(`${API}/things`, ({ request }) => {
        requested = new URL(request.url)
        return HttpResponse.json([{ id: 1 }])
      }),
    )

    const result = await getJson<{ id: number }[]>('/things', {
      params: { userId: 7, name_like: '', other: undefined },
    })

    expect(result).toEqual([{ id: 1 }])
    expect(requested?.searchParams.get('userId')).toBe('7')
    expect(requested?.searchParams.has('name_like')).toBe(false)
    expect(requested?.searchParams.has('other')).toBe(false)
  })

  it('throws an HttpError carrying the status for non-2xx responses', async () => {
    server.use(http.get(`${API}/things`, () => new HttpResponse(null, { status: 500 })))
    await expect(getJson('/things')).rejects.toMatchObject({ name: 'HttpError', status: 500 })
    await expect(getJson('/things')).rejects.toBeInstanceOf(HttpError)
  })
})

describe('postJson', () => {
  it('sends the body as JSON and returns the parsed response', async () => {
    let sent: { contentType: string | null; body: unknown } | undefined
    server.use(
      http.post(`${API}/things`, async ({ request }) => {
        sent = { contentType: request.headers.get('Content-Type'), body: await request.json() }
        return HttpResponse.json({ id: 101 }, { status: 201 })
      }),
    )

    const result = await postJson<{ id: number }>('/things', { title: 'Hi' })

    expect(result).toEqual({ id: 101 })
    expect(sent?.body).toEqual({ title: 'Hi' })
    expect(sent?.contentType).toContain('application/json')
  })
})
