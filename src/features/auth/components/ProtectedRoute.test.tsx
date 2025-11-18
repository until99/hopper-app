import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import * as AuthContext from '../context/AuthContext'

// Mock dependencies
vi.mock('../context/AuthContext')
vi.mock('../../layout/components/PageLayout', () => ({
  PageLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="page-layout">{children}</div>
  ),
}))
vi.mock('./DataInitializer', () => ({
  DataInitializer: () => <div data-testid="data-initializer">Data Initializer</div>,
}))

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state when loading is true', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      isAuthenticated: false,
      loading: true,
      user: null,
      token: null,
      login: vi.fn(),
      logout: vi.fn(),
      isAdmin: vi.fn(),
    })

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    )

    expect(screen.getByText('Carregando...')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('redirects to login when not authenticated', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      isAuthenticated: false,
      loading: false,
      user: null,
      token: null,
      login: vi.fn(),
      logout: vi.fn(),
      isAdmin: vi.fn(),
    })

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    )

    expect(screen.getByText('Login Page')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('renders children when authenticated', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      isAuthenticated: true,
      loading: false,
      user: {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
        active: true,
      },
      token: 'test-token',
      login: vi.fn(),
      logout: vi.fn(),
      isAdmin: vi.fn(),
    })

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    )

    expect(screen.getByTestId('page-layout')).toBeInTheDocument()
    expect(screen.getByTestId('data-initializer')).toBeInTheDocument()
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('wraps children in PageLayout', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      isAuthenticated: true,
      loading: false,
      user: {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
        active: true,
      },
      token: 'test-token',
      login: vi.fn(),
      logout: vi.fn(),
      isAdmin: vi.fn(),
    })

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Test Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    )

    const layout = screen.getByTestId('page-layout')
    expect(layout).toBeInTheDocument()
    expect(layout).toContainElement(screen.getByText('Test Content'))
  })

  it('includes DataInitializer when authenticated', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      isAuthenticated: true,
      loading: false,
      user: {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
        active: true,
      },
      token: 'test-token',
      login: vi.fn(),
      logout: vi.fn(),
      isAdmin: vi.fn(),
    })

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Test Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    )

    expect(screen.getByTestId('data-initializer')).toBeInTheDocument()
  })
})
