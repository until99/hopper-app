import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { renderHook } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'
import { useAuthStore } from '../../../store/authStore'
import type { IUser } from '../../users/types/user'

vi.mock('../../../store/authStore')

describe('AuthProvider', () => {
  const mockInitAuth = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAuthStore).mockImplementation((selector: any) => {
      const state = {
        initAuth: mockInitAuth,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        login: vi.fn(),
        logout: vi.fn(),
        isAdmin: vi.fn(() => false),
      }
      return selector ? selector(state) : state
    })
  })

  it('renders children', () => {
    render(
      <AuthProvider>
        <div>Test Child</div>
      </AuthProvider>
    )
    expect(screen.getByText('Test Child')).toBeInTheDocument()
  })

  it('calls initAuth on mount', async () => {
    render(
      <AuthProvider>
        <div>Test</div>
      </AuthProvider>
    )

    await waitFor(() => {
      expect(mockInitAuth).toHaveBeenCalledTimes(1)
    })
  })
})

describe('useAuth', () => {
  const mockUser: IUser = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    role: 'user',
    active: true,
  }

  const mockLogin = vi.fn()
  const mockLogout = vi.fn()
  const mockIsAdmin = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns auth state from store', () => {
    vi.mocked(useAuthStore).mockImplementation((selector: any) => {
      const state = {
        user: mockUser,
        token: 'test-token',
        isAuthenticated: true,
        loading: false,
        login: mockLogin,
        logout: mockLogout,
        isAdmin: mockIsAdmin,
        initAuth: vi.fn(),
      }
      return selector ? selector(state) : state
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.token).toBe('test-token')
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.loading).toBe(false)
  })

  it('returns auth actions from store', () => {
    vi.mocked(useAuthStore).mockImplementation((selector: any) => {
      const state = {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        login: mockLogin,
        logout: mockLogout,
        isAdmin: mockIsAdmin,
        initAuth: vi.fn(),
      }
      return selector ? selector(state) : state
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.login).toBe(mockLogin)
    expect(result.current.logout).toBe(mockLogout)
    expect(result.current.isAdmin).toBe(mockIsAdmin)
  })

  it('handles unauthenticated state', () => {
    vi.mocked(useAuthStore).mockImplementation((selector: any) => {
      const state = {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        login: mockLogin,
        logout: mockLogout,
        isAdmin: mockIsAdmin,
        initAuth: vi.fn(),
      }
      return selector ? selector(state) : state
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('handles loading state', () => {
    vi.mocked(useAuthStore).mockImplementation((selector: any) => {
      const state = {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: true,
        login: mockLogin,
        logout: mockLogout,
        isAdmin: mockIsAdmin,
        initAuth: vi.fn(),
      }
      return selector ? selector(state) : state
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.loading).toBe(true)
  })
})
