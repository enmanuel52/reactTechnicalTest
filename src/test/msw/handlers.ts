import type { RequestHandler } from 'msw'

/** Default handlers; feature tests add or override their own with `server.use(...)`. */
export const handlers: RequestHandler[] = []
