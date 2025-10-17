import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Navbar from './layout/Navbar'

interface ProtectedRouteProps {
    children: React.ReactElement
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated, loading } = useAuth()

    if (loading) {
        return <div>Carregando...</div>
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return <><Navbar />{children}</>
}

export default ProtectedRoute
