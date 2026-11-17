import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'
import { usePreferences } from '@/shared/store/preferences'
import { API, makePosts, postsHandler } from '@/test/msw/handlers'
import { server } from '@/test/msw/server'
import { renderApp } from '@/test/renderWithProviders'

const postsList = () =>
  within(screen.getByRole('region', { name: 'Posts' })).queryAllByRole('article')

describe('user detail page', () => {
  beforeEach(() => usePreferences.setState({ theme: 'light', lang: 'en' }))

  it('shows the selected user with their posts when picked from the list', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(await screen.findByRole('link', { name: /Ervin Howell/ }))

    expect(
      await screen.findByRole('heading', { name: 'Ervin Howell', level: 2 }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'ervin@example.com' })).toHaveAttribute(
      'href',
      'mailto:ervin@example.com',
    )
    await waitFor(() => expect(postsList()).toHaveLength(10))
    expect(screen.getByText('10 posts')).toBeInTheDocument()
    expect(screen.getAllByText('Post 1 by user 2')).toHaveLength(1)
    // The selected user is highlighted in the list.
    expect(screen.getByRole('link', { name: /Ervin Howell/ })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('loads the user on a cold deep link, before the list has cached them', async () => {
    renderApp({ route: '/users/7' })

    expect(
      await screen.findByRole('heading', { name: 'Kurtis Weissnat', level: 2 }),
    ).toBeInTheDocument()
    await waitFor(() => expect(postsList()).toHaveLength(10))
    expect(screen.getAllByText('Post 1 by user 7').length).toBeGreaterThan(0)
  })

  it('shows a not-found state for unknown or invalid user ids', async () => {
    renderApp({ route: '/users/999' })
    expect(await screen.findByRole('heading', { name: 'User not found' })).toBeInTheDocument()
  })

  it('shows a loading state, then a contained error with retry when posts fail', async () => {
    const user = userEvent.setup()
    server.use(http.get(`${API}/posts`, () => new HttpResponse(null, { status: 500 })))
    renderApp({ route: '/users/1' })

    const alert = await screen.findByText("We couldn't load posts")
    // The rest of the page keeps working: the user and the list are still there.
    expect(screen.getByRole('heading', { name: 'Leanne Graham', level: 2 })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Ervin Howell/ })).toBeInTheDocument()

    server.resetHandlers()
    await user.click(
      within(alert.closest('[role="alert"]') as HTMLElement).getByRole('button', {
        name: 'Try again',
      }),
    )

    await waitFor(() => expect(postsList()).toHaveLength(10))
    expect(screen.queryByText("We couldn't load posts")).not.toBeInTheDocument()
  })

  it('shows an empty state for a user without posts', async () => {
    server.use(postsHandler(0))
    renderApp({ route: '/users/1' })

    expect(await screen.findByText('No posts yet')).toBeInTheDocument()
    expect(screen.getByText('Write the first one with the form.')).toBeInTheDocument()
  })

  it("loads all of a user's posts in a single request, without pagination", async () => {
    const requests: URL[] = []
    server.use(
      http.get(`${API}/posts`, ({ request }) => {
        requests.push(new URL(request.url))
        return HttpResponse.json(makePosts(1, 25))
      }),
    )
    renderApp({ route: '/users/1' })

    // More posts than the old page size of 10: all of them render at once.
    await waitFor(() => expect(postsList()).toHaveLength(25))
    expect(screen.getByText('25 posts')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Load more' })).not.toBeInTheDocument()

    expect(requests).toHaveLength(1)
    expect(requests[0]?.searchParams.get('userId')).toBe('1')
    expect(requests[0]?.searchParams.has('_page')).toBe(false)
    expect(requests[0]?.searchParams.has('_limit')).toBe(false)
  })

  it('offers a way back to the list that keeps the current search', async () => {
    renderApp({ route: '/users/2?q=ervin' })

    const back = await screen.findByRole('link', { name: 'Users' })
    expect(back).toHaveAttribute('href', '/?q=ervin')
  })
})
