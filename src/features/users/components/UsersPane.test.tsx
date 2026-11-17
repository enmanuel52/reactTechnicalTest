import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'
import { usePreferences } from '@/shared/store/preferences'
import { API, makeUsers } from '@/test/msw/handlers'
import { server } from '@/test/msw/server'
import { renderApp } from '@/test/renderWithProviders'

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

  it('loads every user in a single request, without pagination', async () => {
    const requests: URL[] = []
    server.use(
      http.get(`${API}/users`, ({ request }) => {
        requests.push(new URL(request.url))
        return HttpResponse.json(makeUsers(25))
      }),
    )
    renderApp()

    // More users than the old page size of 10: all of them render at once.
    const list = await screen.findByRole('list')
    await waitFor(() => expect(within(list).getAllByRole('link')).toHaveLength(25))
    expect(screen.getByText('25 users')).toBeInTheDocument()
    expect(within(list).getAllByRole('link').at(-1)).toHaveTextContent('Test User 25')

    expect(requests).toHaveLength(1)
    expect(requests[0]?.searchParams.has('_page')).toBe(false)
    expect(requests[0]?.searchParams.has('_limit')).toBe(false)
  })

  it('ends the list with the last user, with no load-more control', async () => {
    const requests: string[] = []
    server.use(
      http.get(`${API}/users`, () => {
        requests.push('users')
        return HttpResponse.json(makeUsers(10))
      }),
    )
    renderApp()
    const list = await screen.findByRole('list')
    await waitFor(() => expect(within(list).getAllByRole('link')).toHaveLength(10))
    expect(within(list).getAllByRole('link').at(-1)).toHaveTextContent('Clementina DuBuque')

    expect(screen.queryByRole('button', { name: 'Load more' })).not.toBeInTheDocument()
    expect(screen.queryByText('Loading more…')).not.toBeInTheDocument()
    expect(requests).toHaveLength(1)
  })
})
