import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// Auth
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Login from './pages/auth/login'

// 404
import NotFoundPage from './pages/notFoundPage'

// Dashboard
import Workspaces from './pages/workspace/workspaces'
import Dashboards from './pages/workspace/dashboard/dashboards'
import DashboardId from './pages/workspace/dashboard/$dashboard'
import CrudDashboard from './pages/admin/dashboards/dashboard'

// Users
import CrudUsers from './pages/admin/users/users'

// Groups
import Groups from './pages/admin/groups/group'

const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '*', element: <NotFoundPage /> },
  {
    path: '/workspaces',
    element: (
      <ProtectedRoute>
        <Workspaces />
      </ProtectedRoute>
    )
  },
  {
    path: '/workspaces/:groupId/dashboards',
    element: (
      <ProtectedRoute>
        <Dashboards />
      </ProtectedRoute>
    )
  },
  {
    path: '/groups/:groupId/dashboards/:dashboardId',
    element: (
      <ProtectedRoute>
        <DashboardId />
      </ProtectedRoute>
    )
  },
  {
    path: '/dashboard',
    element: (
      <AdminRoute>
        <CrudDashboard />
      </AdminRoute>
    )
  },
  {
    path: '/users/',
    element: (
      <AdminRoute>
        <CrudUsers />
      </AdminRoute>
    )
  },
  {
    path: '/groups',
    element: (
      <AdminRoute>
        <Groups />
      </AdminRoute>
    )
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
