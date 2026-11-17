import { render, screen } from '@testing-library/react'
import { App } from '@/app/App'

describe('test setup', () => {
  it('renders the app inside jsdom', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /thesocialnetwork/i })).toBeInTheDocument()
  })
})
