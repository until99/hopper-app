import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface AdminRouteProps {
    children: React.ReactElement
}

const AdminRoute = ({ children }: AdminRouteProps) => {
    const { isAuthenticated, loading, user } = useAuth()

    if (loading) {
        return <div>Thinking...</div>
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (user?.role !== 'admin') {
        return <Navigate to="/groups" replace />
    }

    return children
}

export default AdminRoute
