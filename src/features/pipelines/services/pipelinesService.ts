import { api } from '../../../lib/axios';
import type { PipelinesResponse } from '../types/pipeline';
import type { IDashboard } from '../../dashboard/types/dashboard';

export const pipelinesService = {
    /**
     * Busca todos os pipelines
     */
    async fetchPipelines(): Promise<PipelinesResponse> {
        const response = await api.get<PipelinesResponse>('/pipelines');
        return response.data;
    },

    /**
     * Busca todos os dashboards (para vincular com pipeline)
     */
    async fetchDashboards(): Promise<IDashboard[]> {
        const response = await api.get<{ dashboards: IDashboard[] }>('/dashboards');
        return response.data.dashboards || response.data || [];
    },

    /**
     * Vincula um dashboard a um pipeline
     */
    async linkDashboard(pipelineId: string, dashboardId: string): Promise<void> {
        await api.post(`/pipelines/${pipelineId}/link-dashboard`, { dashboardId });
    }
};

