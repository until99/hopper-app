import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Navbar from './layout/Navbar'

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

    return <><Navbar />{children}</>
}

export default AdminRoute
