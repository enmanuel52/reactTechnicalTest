import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'
import { usePreferences } from '@/shared/store/preferences'
import { API, usersHandler } from '@/test/msw/handlers'
import { server } from '@/test/msw/server'
import { renderApp } from '@/test/renderWithProviders'
import { act } from 'react'

function triggerIntersection() {
  const observers = (IntersectionObserver as unknown as { instances: { trigger: () => void }[] })
    .instances
  act(() => observers.at(-1)?.trigger())
}

describe('UsersPane', () => {
  beforeEach(() => usePreferences.setState({ theme: 'light', lang: 'en' }))

  it('shows a loading state, then the users with their count', async () => {
    renderApp()

    expect(screen.getByText('Loading users…')).toBeInTheDocument()

    const list = await screen.findByRole('list')
    expect(within(list).getAllByRole('link')).toHaveLength(10)
    expect(within(list).getByText('Leanne Graham')).toBeInTheDocument()
    expect(screen.getByText('10 users')).toBeInTheDocument()
    expect(screen.queryByText('Loading users…')).not.toBeInTheDocument()
  })

  it('shows an error with a retry button that recovers', async () => {
    const user = userEvent.setup()
    server.use(http.get(`${API}/users`, () => new HttpResponse(null, { status: 500 })))
    renderApp()

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent("We couldn't load users")

    server.resetHandlers()
    await user.click(within(alert).getByRole('button', { name: 'Try again' }))

    expect(await screen.findByText('Leanne Graham')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('loads further pages of 10 only when the Load more icon button is pressed', async () => {
    const user = userEvent.setup()
    server.use(usersHandler(25))
    renderApp()

    await screen.findByText('Leanne Graham')
    expect(screen.getAllByRole('link')).toHaveLength(10)
    expect(screen.getByText('25 users')).toBeInTheDocument()

    // Scrolling to the end does nothing: no automatic loading for users.
    triggerIntersection()
    expect(screen.getAllByRole('link')).toHaveLength(10)

    await user.click(screen.getByRole('button', { name: 'Load more' }))
    await waitFor(() => expect(screen.getAllByRole('link')).toHaveLength(20))

    await user.click(await screen.findByRole('button', { name: 'Load more' }))
    await waitFor(() => expect(screen.getAllByRole('link')).toHaveLength(25))

    // Everything is loaded, so the button goes away.
    expect(screen.queryByRole('button', { name: 'Load more' })).not.toBeInTheDocument()
  })

  it('keeps loaded users and offers a retry when the next page fails', async () => {
    const user = userEvent.setup()
    server.use(usersHandler(25))
    renderApp()
    await screen.findByText('Leanne Graham')

    server.use(
      http.get(`${API}/users`, ({ request }) =>
        new URL(request.url).searchParams.get('_page') === '2'
          ? new HttpResponse(null, { status: 500 })
          : HttpResponse.json([]),
      ),
    )
    await user.click(screen.getByRole('button', { name: 'Load more' }))

    const alert = await screen.findByText("We couldn't load more.")
    expect(alert).toBeInTheDocument()
    expect(screen.getAllByRole('link')).toHaveLength(10)

    server.resetHandlers(usersHandler(25))
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    await waitFor(() => expect(screen.getAllByRole('link')).toHaveLength(20))
  })
})
