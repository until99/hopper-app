import { api } from "../../../lib/axios";
import type { Dashboard, DashboardsResponse } from "../types/dashboard";

export const dashboardService = {
  /**
   * Busca todos os dashboards
   */
  async fetchDashboards(): Promise<DashboardsResponse> {
    const response = await api.get<DashboardsResponse>("/dashboards");
    return response.data;
  },

  /**
   * Busca dashboards de um grupo específico
   */
  async fetchGroupDashboards(
    groupId: string,
    isAdmin?: boolean
  ): Promise<DashboardsResponse> {
    // Independente de ser admin ou não, busca os dashboards do grupo específico
    const response = await api.get<Dashboard[]>(
      `/app/groups/${groupId}/dashboards`
    );
    // A API retorna um array direto, então encapsulamos no formato esperado
    return { dashboards: response.data };
  },

  /**
   * Busca pipeline associado a um dashboard
   */
  async fetchPipelineAssociation(dashboardId: string): Promise<string | null> {
    try {
      const response = await api.get(`/app/dashboards/${dashboardId}/pipeline`);
      
      // Verifica se a resposta tem um array de items
      if (response.data.items && Array.isArray(response.data.items) && response.data.items.length > 0) {
        return response.data.items[0].pipeline_id;
      }
      
      // Verifica se a resposta é um objeto direto com pipeline_id
      if (response.data && 'pipeline_id' in response.data) {
        // Se pipeline_id é null, retorna null (dashboard sem pipeline vinculado)
        // Se pipeline_id tem valor, retorna o valor (ex: "weather_report")
        return response.data.pipeline_id;
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching pipeline association for dashboard ${dashboardId}:`, error);
      return null;
    }
  },

  /**
   * Executa o pipeline associado a um dashboard
   */
  async runPipeline(dashboardId: string): Promise<void> {
    await api.post(`/app/dashboards/${dashboardId}/pipeline/refresh`, {});
  },

  /**
   * Busca detalhes de um dashboard específico
   */
  async fetchDashboardDetails(
    groupId: string,
    dashboardId: string
  ): Promise<any> {
    const response = await api.get(`/groups/${groupId}/report/${dashboardId}`);
    return response.data;
  },

  /**
   * Desvincula pipeline de um dashboard
   */
  async unlinkPipeline(dashboardId: string): Promise<void> {
    await api.delete(`/app/dashboards/${dashboardId}/pipeline`);
  },

  /**
   * Deleta um dashboard
   */
  async deleteDashboard(
    dashboardId: string,
    groupId: string,
    datasetId: string
  ): Promise<void> {
    await api.delete(`/dashboards/${dashboardId}`, {
      data: { groupId, datasetId },
    });
  },
};
