import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import axios from 'axios'
import type { User } from '../interfaces/user'

interface AuthContextType {
    isAuthenticated: boolean
    user: User | null
    login: (email: string, password: string) => Promise<boolean>
    logout: () => void
    loading: boolean
    isAdmin: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await axios.post(`${API_URL}/user/auth`, {
                "email": email,
                "password": password,
            })

            if (response.data && response.data.token) {
                const { token, record } = response.data

                localStorage.setItem('authToken', token)

                setUser(record)
                setIsAuthenticated(true)

                setLoading(false)
                return true
            }
            return false
        } catch (error) {
            console.error('Erro ao fazer login:', error)
            setLoading(false)
            return false
        }
    }

    const logout = () => {
        localStorage.removeItem('authToken')
        setUser(null)
        setIsAuthenticated(false)
    }

    const isAdmin = () => {
        return user?.roles === 'admin'
    }

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('authToken')

            if (token) {
                try {
                    setIsAuthenticated(true)
                } catch (error) {
                    console.error('Erro ao verificar autenticação:', error)
                    localStorage.removeItem('authToken')
                    localStorage.removeItem('userId')
                }
            }
            setLoading(false)
        }

        checkAuth()
    }, [])

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading, isAdmin }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
