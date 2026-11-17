import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'
import { usePreferences } from '@/shared/store/preferences'
import { API, usersHandler } from '@/test/msw/handlers'
import { server } from '@/test/msw/server'
import { renderApp } from '@/test/renderWithProviders'

const searchBox = () => screen.getByRole('searchbox', { name: 'Search users by name' })
const userLinks = () => within(screen.getByRole('list')).queryAllByRole('link')

describe('user search', () => {
  beforeEach(() => usePreferences.setState({ theme: 'light', lang: 'en' }))

  it('filters users by name on the server and mirrors the query in the URL', async () => {
    const user = userEvent.setup()
    const { router } = renderApp()
    await screen.findByText('Leanne Graham')

    await user.type(searchBox(), 'LEANNE')

    await waitFor(() => expect(userLinks()).toHaveLength(1))
    expect(userLinks()[0]).toHaveTextContent('Leanne Graham')
    expect(screen.getByText('1 user')).toBeInTheDocument()
    await waitFor(() => expect(router.state.location.search).toBe('?q=LEANNE'))
  })

  it('shows a no-results state and restores the full list when cleared', async () => {
    const user = userEvent.setup()
    const { router } = renderApp()
    await screen.findByText('Leanne Graham')

    await user.type(searchBox(), 'zzz')
    const message = await screen.findByText('No users match "zzz"')
    expect(userLinks()).toHaveLength(0)

    // The empty state has its own "Clear search" button (the search bar's icon button shares the name).
    await user.click(within(message.parentElement!).getByRole('button', { name: 'Clear search' }))

    await waitFor(() => expect(userLinks()).toHaveLength(10))
    expect(searchBox()).toHaveValue('')
    await waitFor(() => expect(router.state.location.search).toBe(''))
  })

  it('escapes regex characters so special input is a plain search, not a server error', async () => {
    const user = userEvent.setup()
    const requested: string[] = []
    server.use(
      http.get(`${API}/users`, ({ request }) => {
        requested.push(new URL(request.url).searchParams.get('name_like') ?? '')
        return HttpResponse.json([], { headers: { 'X-Total-Count': '0' } })
      }),
    )
    renderApp()
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())

    await user.type(searchBox(), '(')

    expect(await screen.findByText('No users match "("')).toBeInTheDocument()
    expect(requested).toContain('\\(')
    expect(screen.queryByText("We couldn't load users")).not.toBeInTheDocument()
  })

  it('starts from the ?q= param and keeps it on the links to each user', async () => {
    server.use(usersHandler(10))
    renderApp({ route: '/?q=ervin' })

    expect(searchBox()).toHaveValue('ervin')
    await waitFor(() => expect(userLinks()).toHaveLength(1))
    expect(userLinks()[0]).toHaveAttribute('href', '/users/2?q=ervin')
  })
})
