// Pages
export { default as Dashboards } from './pages/dashboards'
export { default as DashboardDetails } from './pages/$dashboard'
export { default as CrudDashboard } from './pages/CrudDashboard'

// Modals
export { default as DeleteDashboardModal } from './modals/DeleteDashboardModal'

// Services
export { dashboardService } from './services/dashboardService'

// Hooks
export { useDashboards } from './hooks/useDashboards'
export { useGroupDashboards } from './hooks/useGroupDashboards'
export { useDashboardDetails } from './hooks/useDashboardDetails'
export { usePipelineActions } from './hooks/usePipelineActions'

// Components
export { DashboardsTable } from './components/DashboardsTable'

// Types
export type { Dashboard, DashboardsResponse, PipelineAssociation } from './types/dashboard'
