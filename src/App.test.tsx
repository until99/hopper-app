import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import App from './App'

// Mock router and auth provider
vi.mock('./routes', () => ({
  router: {
    routes: [],
  },
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  ),
}))

vi.mock('react-router-dom', () => ({
  RouterProvider: () => (
    <div data-testid="router-provider">Router Provider</div>
  ),
}))

describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />)
    expect(container).toBeInTheDocument()
  })

  it('wraps RouterProvider with AuthProvider', () => {
    const { getByTestId } = render(<App />)
    
    expect(getByTestId('auth-provider')).toBeInTheDocument()
    expect(getByTestId('router-provider')).toBeInTheDocument()
  })
})
