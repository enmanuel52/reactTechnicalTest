import '@testing-library/jest-dom/vitest'
import 'fake-indexeddb/auto'
import { cleanup } from '@testing-library/react'
import { db } from '@/shared/db/db'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from './msw/server'

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
afterEach(async () => {
  cleanup()
  await db.posts.clear()
  server.resetHandlers()
})
afterAll(() => server.close())
