import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// 404
import NotFoundPage from './pages/notFoundPage'

// Dashboard
import Dashboards from './pages/admin/dashboard/dashboards'
import DashboardId from './pages/admin/dashboard/$dashboard'
import CrudDashboard from './pages/admin/dashboard/crudDashboard'

const router = createBrowserRouter([
  { path: '*', element: <NotFoundPage /> },
  { path: '/dashboard', element: <CrudDashboard /> },
  { path: '/', element: <Dashboards /> },
  { path: '/dashboards/:id', element: <DashboardId /> },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
