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
import Dashboards from './pages/dashboard/dashboards'
import DashboardId from './pages/dashboard/$dashboard'
import CrudDashboard from './pages/admin/dashboard/dashboard'

const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '*', element: <NotFoundPage /> },
  {
    path: '/dashboards',
    element: (
      <ProtectedRoute>
        <Dashboards />
      </ProtectedRoute>
    )
  },
  {
    path: '/dashboards/:id',
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
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
