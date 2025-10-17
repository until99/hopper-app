import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface AdminRouteProps {
    children: React.ReactElement
}

const AdminRoute = ({ children }: AdminRouteProps) => {
    const { isAuthenticated, loading, isAdmin } = useAuth()

    if (loading) {
        return <div>Thinking...</div>
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (!isAdmin()) {
        return <Navigate to="/" replace />
    }

    return children
}

export default AdminRoute
