import { describe, expect, it } from 'vitest'
import { HttpError } from '@/shared/api/http'
import { shouldRetry } from './queryClient'

describe('shouldRetry', () => {
  it('retries a network or server failure once', () => {
    expect(shouldRetry(0, new TypeError('Failed to fetch'))).toBe(true)
    expect(shouldRetry(0, new HttpError(503))).toBe(true)
    expect(shouldRetry(1, new HttpError(503))).toBe(false)
  })

  it('never retries client errors', () => {
    expect(shouldRetry(0, new HttpError(404))).toBe(false)
  })
})
