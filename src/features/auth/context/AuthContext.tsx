import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useAuthStore } from '../../../store/authStore'

/**
 * AuthProvider Component
 * 
 * Simplified provider that initializes the auth store on mount.
 * The actual auth state is managed by Zustand in authStore.ts
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const initAuth = useAuthStore((state) => state.initAuth)

    useEffect(() => {
        initAuth()
    }, [initAuth])

    return <>{children}</>
}

/**
 * useAuth Hook
 * 
 * Custom hook to access auth store.
 * Provides all auth state and actions from Zustand store.
 * 
 * @example
 * const { user, isAuthenticated, login, logout } = useAuth()
 */
export const useAuth = () => {
    const user = useAuthStore((state) => state.user)
    const token = useAuthStore((state) => state.token)
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const loading = useAuthStore((state) => state.loading)
    const login = useAuthStore((state) => state.login)
    const logout = useAuthStore((state) => state.logout)
    const isAdmin = useAuthStore((state) => state.isAdmin)

    return {
        user,
        token,
        isAuthenticated,
        loading,
        login,
        logout,
        isAdmin
    }
}
