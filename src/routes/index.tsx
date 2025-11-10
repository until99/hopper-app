import { createBrowserRouter } from 'react-router-dom'

// Auth
import { AuthProvider, Login, ProtectedRoute, AdminRoute } from '../features/auth'

// Error pages
import { NotFoundPage } from '../features/error'

// Workspace
import { Workspaces } from '../features/workspace'

// Dashboard
import { Dashboards, DashboardDetails, CrudDashboard } from '../features/dashboard'

// Users
import { CrudUsers } from '../features/users'

// Groups
import { Groups, GroupUsers, GroupDashboard } from '../features/groups'

// Pipelines
import { Pipelines } from '../features/pipelines'

export const router = createBrowserRouter([
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
    path: '/workspaces/:groupId/dashboards/:dashboardId',
    element: (
      <ProtectedRoute>
        <DashboardDetails />
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
  },
  {
    path: '/admin/groups/:groupId/users',
    element: (
      <AdminRoute>
        <GroupUsers />
      </AdminRoute>
    )
  },
  {
    path: '/admin/groups/:groupId/dashboards',
    element: (
      <AdminRoute>
        <GroupDashboard />
      </AdminRoute>
    )
  },
  {
    path: '/pipelines/',
    element: (
      <AdminRoute>
        <Pipelines />
      </AdminRoute>
    )
  }
])

export { AuthProvider }
