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

    useEffect(() => {
        // Verificar se existe um token e userId armazenados
        const token = localStorage.getItem('authToken')
        const userId = localStorage.getItem('userId')

        if (token && userId) {
            // Buscar dados do usuário
            fetchUserData(userId)
        } else {
            setLoading(false)
        }
    }, [])

    const fetchUserData = async (userId: string) => {
        try {
            const response = await axios.get(`${API_URL}/user/${userId}`)
            if (response.data) {
                setUser(response.data)
                setIsAuthenticated(true)
            }
        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error)
            // Se falhar, limpar dados de autenticação
            localStorage.removeItem('authToken')
            localStorage.removeItem('userId')
        } finally {
            setLoading(false)
        }
    }

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await axios.post(`${API_URL}/user/auth`, {
                "email": email,
                "password": password,
            })

            if (response.data && response.data.token) {
                const { token, record } = response.data

                localStorage.setItem('authToken', token)
                localStorage.setItem('userId', record.id)

                setUser(record)
                setIsAuthenticated(true)
                return true
            }
            return false
        } catch (error) {
            console.error('Erro ao fazer login:', error)
            return false
        }
    }

    const logout = () => {
        localStorage.removeItem('authToken')
        localStorage.removeItem('userId')
        setUser(null)
        setIsAuthenticated(false)
    }

    const isAdmin = () => {
        return user?.roles === 'admin'
    }

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
