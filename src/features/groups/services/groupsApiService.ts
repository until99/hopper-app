import { api } from "../../../lib/axios";
import type { IGroup, IGroupsApiResponse } from "../types/Group";

export const groupsService = {
  /**
   * Busca todos os grupos
   * Para admin: retorna todos os grupos do sistema
   * Para usuário comum: retorna apenas grupos vinculados
   */
  async fetchGroups(isAdmin?: boolean): Promise<IGroup[]> {
    // Usa o mesmo endpoint /app/groups para todos
    // O backend deve retornar todos os grupos para admin
    const response = await api.get<IGroupsApiResponse>("/app/groups");

    // Garantir que sempre retorne um array
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data && response.data.items) {
      return response.data.items;
    }
    return [];
  },

  /**
   * Busca grupos de um usuário específico
   */
  async fetchUserGroups(userId: string): Promise<IGroup[]> {
    const response = await api.get<IGroupsApiResponse>(
      `/app/users/${userId}/groups`
    );
    return response.data.items;
  },

  /**
   * Cria um novo grupo
   */
  async createGroup(groupData: Partial<IGroup>): Promise<IGroup> {
    const response = await api.post<IGroup>("/app/groups", null, {
      params: {
        name: groupData.name,
        description: groupData.description,
      },
    });
    return response.data;
  },

  /**
   * Atualiza um grupo existente
   */
  async updateGroup(
    groupId: string,
    groupData: Partial<IGroup>
  ): Promise<IGroup> {
    const response = await api.put<IGroup>(`/app/groups/${groupId}`, groupData);
    return response.data;
  },

  /**
   * Deleta um grupo
   */
  async deleteGroup(groupId: string): Promise<void> {
    await api.delete(`/app/groups/${groupId}`);
  },

  /**
   * Busca informações de um grupo específico
   */
  async fetchGroupInfo(groupId: string): Promise<IGroup> {
    const response = await api.get<IGroup>(`/app/groups/${groupId}`);
    return response.data;
  },

  /**
   * Busca usuários de um grupo
   */
  async fetchGroupUsers(groupId: string): Promise<any[]> {
    const response = await api.get<any[]>(`/app/groups/${groupId}/users`);
    return response.data;
  },

  /**
   * Remove um usuário de um grupo
   */
  async removeUserFromGroup(groupId: string, userId: string): Promise<void> {
    await api.delete(`/app/groups/${groupId}/users/${userId}`);
  },

  /**
   * Adiciona um usuário a um grupo
   */
  async addUserToGroup(groupId: string, userId: string): Promise<void> {
    await api.post(`/app/groups/${groupId}/users/${userId}`, { userId });
  },

  /**
   * Busca dashboards de um grupo
   */
  async fetchGroupDashboards(groupId: string): Promise<any[]> {
    const response = await api.get<any[]>(`/app/groups/${groupId}/dashboards`);
    return response.data;
  },

  /**
   * Remove um dashboard de um grupo
   */
  async removeDashboardFromGroup(
    groupId: string,
    dashboardId: string
  ): Promise<void> {
    await api.delete(`/app/groups/${groupId}/dashboards/${dashboardId}`);
  },

  /**
   * Adiciona um dashboard a um grupo
   */
  async addDashboardToGroup(
    groupId: string,
    dashboardId: string
  ): Promise<void> {
    await api.post(`/app/groups/${groupId}/dashboards/${dashboardId}`, {
      dashboardId,
    });
  },
};
