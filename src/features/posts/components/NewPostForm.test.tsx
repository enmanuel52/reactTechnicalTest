import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { delay, http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/shared/db/db'
import { usePreferences } from '@/shared/store/preferences'
import { useToastStore } from '@/shared/store/toast'
import { API } from '@/test/msw/handlers'
import { server } from '@/test/msw/server'
import { renderApp } from '@/test/renderWithProviders'

const title = () => screen.getByRole('textbox', { name: /^Title/ })
const text = () => screen.getByRole('textbox', { name: /^Text/ })
const publish = () => screen.getByRole('button', { name: /Publish/ })
const posts = () => within(screen.getByRole('region', { name: 'Posts' })).queryAllByRole('article')

/** Records POST /posts bodies while still answering like the real API (after `latency` ms). */
function recordCreates(latency = 0) {
  const bodies: unknown[] = []
  server.use(
    http.post(`${API}/posts`, async ({ request }) => {
      await delay(latency)
      const body = (await request.json()) as Record<string, unknown>
      bodies.push(body)
      return HttpResponse.json({ ...body, id: 101 }, { status: 201 })
    }),
  )
  return bodies
}

describe('new post form', () => {
  beforeEach(() => {
    usePreferences.setState({ theme: 'light', lang: 'en' })
    useToastStore.setState({ toast: null })
  })

  it('validates title and text, focuses the first error and sends nothing', async () => {
    const user = userEvent.setup()
    const bodies = recordCreates()
    renderApp({ route: '/users/1' })
    await screen.findByRole('heading', { name: 'Leanne Graham', level: 2 })

    await user.click(publish())

    expect(await screen.findByText('Add a title.')).toBeInTheDocument()
    expect(screen.getByText('Write the post text.')).toBeInTheDocument()
    expect(title()).toHaveAttribute('aria-invalid', 'true')
    expect(title()).toHaveFocus()
    expect(bodies).toHaveLength(0)
    expect(await db.posts.count()).toBe(0)

    // Errors clear as soon as the field is valid again.
    await user.type(title(), 'Hello')
    await waitFor(() => expect(screen.queryByText('Add a title.')).not.toBeInTheDocument())
  })

  it('rejects whitespace-only input and titles longer than 100 characters', async () => {
    const user = userEvent.setup()
    renderApp({ route: '/users/1' })
    await screen.findByRole('heading', { name: 'Leanne Graham', level: 2 })

    await user.type(title(), '    ')
    await user.type(text(), '   ')
    await user.click(publish())
    expect(await screen.findByText('Add a title.')).toBeInTheDocument()
    expect(screen.getByText('Write the post text.')).toBeInTheDocument()

    await user.clear(title())
    await user.click(title())
    await user.paste('a'.repeat(101))
    expect(screen.getByText('101/100')).toBeInTheDocument()
    await user.click(publish())
    expect(await screen.findByText('100 characters max.')).toBeInTheDocument()
  })

  it('publishes: sends the POST, saves locally and shows the post first with a "New" badge', async () => {
    const user = userEvent.setup()
    const bodies = recordCreates(150)
    renderApp({ route: '/users/1' })
    await waitFor(() => expect(posts()).toHaveLength(10))

    await user.type(title(), '  My first post  ')
    await user.type(text(), 'Hello world')
    await user.click(publish())

    // In flight: the button is disabled and says so (no double submits).
    expect(await screen.findByRole('button', { name: 'Publishing…' })).toBeDisabled()

    await waitFor(() => expect(posts()).toHaveLength(11))
    const [first] = posts()
    expect(first).toHaveTextContent('My first post')
    expect(first).toHaveTextContent('Hello world')
    expect(within(first!).getByText('New')).toBeInTheDocument()
    expect(within(posts()[1]!).queryByText('New')).not.toBeInTheDocument()
    expect(screen.getByText('11 posts')).toBeInTheDocument()

    // Sent to the API (trimmed, with the author) and persisted in IndexedDB.
    expect(bodies).toEqual([{ userId: 1, title: 'My first post', body: 'Hello world' }])
    expect(await db.posts.toArray()).toMatchObject([
      { userId: 1, title: 'My first post', body: 'Hello world' },
    ])

    // Confirmation, and the form is ready for the next post.
    expect(await screen.findByText('Post published')).toBeInTheDocument()
    expect(title()).toHaveValue('')
    expect(text()).toHaveValue('')
    expect(publish()).toBeEnabled()
  })

  it('pins previously saved posts on top when the page loads, for that user only', async () => {
    await db.posts.bulkAdd([
      { userId: 1, title: 'Older local', body: 'a', createdAt: 1000 },
      { userId: 1, title: 'Newer local', body: 'b', createdAt: 2000 },
      { userId: 2, title: 'Someone else', body: 'c', createdAt: 3000 },
    ])
    renderApp({ route: '/users/1' })

    await waitFor(() => expect(posts()).toHaveLength(12))
    expect(posts()[0]).toHaveTextContent('Newer local')
    expect(posts()[1]).toHaveTextContent('Older local')
    expect(posts()[2]).toHaveTextContent('Post 1 by user 1')
    expect(screen.queryByText('Someone else')).not.toBeInTheDocument()
    expect(screen.getAllByText('New')).toHaveLength(2)
  })

  it('shows local posts even when the API posts fail to load', async () => {
    await db.posts.add({ userId: 1, title: 'Saved offline', body: 'x', createdAt: 1 })
    server.use(http.get(`${API}/posts`, () => new HttpResponse(null, { status: 500 })))
    renderApp({ route: '/users/1' })

    expect(await screen.findByText("We couldn't load posts")).toBeInTheDocument()
    expect(screen.getByText('Saved offline')).toBeInTheDocument()
  })

  it('shows an error and saves nothing when the request fails', async () => {
    const user = userEvent.setup()
    server.use(http.post(`${API}/posts`, () => new HttpResponse(null, { status: 500 })))
    renderApp({ route: '/users/1' })
    await waitFor(() => expect(posts()).toHaveLength(10))

    await user.type(title(), 'Will fail')
    await user.type(text(), 'Body')
    await user.click(publish())

    expect(await screen.findByText("We couldn't publish your post. Try again.")).toBeInTheDocument()
    expect(posts()).toHaveLength(10)
    expect(await db.posts.count()).toBe(0)
    // What the user typed is kept so they can retry.
    expect(title()).toHaveValue('Will fail')
    expect(publish()).toBeEnabled()
  })

  it('translates validation messages with the interface language', async () => {
    const user = userEvent.setup()
    usePreferences.setState({ lang: 'es' })
    renderApp({ route: '/users/1' })
    await screen.findByRole('heading', { name: 'Leanne Graham', level: 2 })

    await user.click(screen.getByRole('button', { name: 'Publicar' }))

    expect(await screen.findByText('Escribe un título.')).toBeInTheDocument()
    expect(screen.getByText('Escribe el texto de la publicación.')).toBeInTheDocument()
  })
})
