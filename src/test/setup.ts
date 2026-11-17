import '@testing-library/jest-dom/vitest'
import 'fake-indexeddb/auto'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, vi } from 'vitest'
import { server } from './msw/server'

// jsdom has no IntersectionObserver; tests trigger intersections manually.
class IntersectionObserverMock implements IntersectionObserver {
  static instances: IntersectionObserverMock[] = []
  readonly root = null
  readonly rootMargin = ''
  readonly scrollMargin = ''
  readonly thresholds = []
  constructor(private callback: IntersectionObserverCallback) {
    IntersectionObserverMock.instances.push(this)
  }
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  takeRecords = () => []
  trigger(isIntersecting = true) {
    this.callback([{ isIntersecting } as IntersectionObserverEntry], this)
  }
}
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
afterEach(() => {
  cleanup()
  server.resetHandlers()
  IntersectionObserverMock.instances = []
})
afterAll(() => server.close())
