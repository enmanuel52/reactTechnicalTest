import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { usePreferences } from '@/shared/store/preferences'
import { renderApp } from '@/test/renderWithProviders'

describe('app shell', () => {
  beforeEach(() => {
    usePreferences.setState({ theme: 'light', lang: 'en' })
    document.documentElement.className = ''
  })

  it('shows the header and the "pick a user" prompt on the home route', () => {
    renderApp()
    expect(screen.getByText('Social')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Pick a user' })).toBeInTheDocument()
  })

  it('switches the whole UI language with the ES/EN control', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: 'Español' }))

    expect(screen.getByRole('heading', { name: 'Elige un usuario' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Español' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('toggles dark mode and updates the toggle label', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: 'Switch to dark mode' }))

    expect(document.documentElement).toHaveClass('dark')
    expect(screen.getByRole('button', { name: 'Switch to light mode' })).toBeInTheDocument()
  })

  it('renders a not-found page for unknown routes', () => {
    renderApp({ route: '/nope' })
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Go to users' })).toHaveAttribute('href', '/')
  })
})
