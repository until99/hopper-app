import { describe, it, expect, vi, beforeEach } from 'vitest'
import { dashboardService } from './dashboardService'
import { api } from '../../../lib/axios'
import type { Dashboard, DashboardsResponse } from '../types/dashboard'

vi.mock('../../../lib/axios', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

describe('dashboardService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchDashboards', () => {
    it('fetches all dashboards successfully', async () => {
      const mockResponse: DashboardsResponse = {
        dashboards: [
          {
            id: '1',
            name: 'Dashboard 1',
            datasetId: 'dataset-1',
            description: 'Test dashboard',
            groupId: 'group-1',
            groupName: 'Test Group',
          },
        ],
      }

      vi.mocked(api.get).mockResolvedValue({ data: mockResponse })

      const result = await dashboardService.fetchDashboards()

      expect(api.get).toHaveBeenCalledWith('/dashboards')
      expect(result).toEqual(mockResponse)
    })

    it('handles fetch error', async () => {
      vi.mocked(api.get).mockRejectedValue(new Error('Network error'))

      await expect(dashboardService.fetchDashboards()).rejects.toThrow('Network error')
    })
  })

  describe('fetchGroupDashboards', () => {
    it('fetches group dashboards and wraps in expected format', async () => {
      const mockDashboards: Dashboard[] = [
        {
          id: '1',
          name: 'Group Dashboard',
          datasetId: 'dataset-1',
          description: 'Test',
          groupId: 'group-1',
          groupName: 'Test Group',
        },
      ]

      vi.mocked(api.get).mockResolvedValue({ data: mockDashboards })

      const result = await dashboardService.fetchGroupDashboards('group-1')

      expect(api.get).toHaveBeenCalledWith('/app/groups/group-1/dashboards')
      expect(result).toEqual({ dashboards: mockDashboards })
    })
  })

  describe('fetchPipelineAssociation', () => {
    it('returns pipeline id when association exists', async () => {
      const mockResponse = {
        data: {
          items: [{ pipeline_id: 'pipeline-123' }],
        },
      }

      vi.mocked(api.get).mockResolvedValue(mockResponse)

      const result = await dashboardService.fetchPipelineAssociation('dashboard-1')

      expect(api.get).toHaveBeenCalledWith('/app/dashboards/dashboard-1/pipeline')
      expect(result).toBe('pipeline-123')
    })

    it('returns null when no pipeline association exists', async () => {
      const mockResponse = {
        data: {
          items: [],
        },
      }

      vi.mocked(api.get).mockResolvedValue(mockResponse)

      const result = await dashboardService.fetchPipelineAssociation('dashboard-1')

      expect(result).toBeNull()
    })

    it('returns null on error', async () => {
      vi.mocked(api.get).mockRejectedValue(new Error('Not found'))

      const result = await dashboardService.fetchPipelineAssociation('dashboard-1')

      expect(result).toBeNull()
    })
  })

  describe('runPipeline', () => {
    it('triggers pipeline run successfully', async () => {
      vi.mocked(api.post).mockResolvedValue({ data: {} })

      await dashboardService.runPipeline('dashboard-1')

      expect(api.post).toHaveBeenCalledWith('/app/dashboards/dashboard-1/pipeline/refresh', {})
    })

    it('handles run pipeline error', async () => {
      vi.mocked(api.post).mockRejectedValue(new Error('Pipeline error'))

      await expect(dashboardService.runPipeline('dashboard-1')).rejects.toThrow('Pipeline error')
    })
  })

  describe('fetchDashboardDetails', () => {
    it('fetches dashboard details successfully', async () => {
      const mockDetails = {
        id: '1',
        name: 'Dashboard Details',
        data: {},
      }

      vi.mocked(api.get).mockResolvedValue({ data: mockDetails })

      const result = await dashboardService.fetchDashboardDetails('group-1', 'dashboard-1')

      expect(api.get).toHaveBeenCalledWith('/groups/group-1/report/dashboard-1')
      expect(result).toEqual(mockDetails)
    })
  })
})
