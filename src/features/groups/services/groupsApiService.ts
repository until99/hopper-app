import { api } from '../../../lib/axios';
import type { IGroup, IGroupsApiResponse } from '../types/Group';

export const groupsService = {
    /**
     * Busca todos os grupos
     */
    async fetchGroups(): Promise<IGroup[]> {
        const response = await api.get<IGroupsApiResponse>('/app/groups');
        return response.data.items;
    },

    /**
     * Busca grupos de um usuário específico
     */
    async fetchUserGroups(userId: string): Promise<IGroup[]> {
        const response = await api.get<IGroupsApiResponse>(`/app/users/${userId}/groups`);
        return response.data.items;
    },

    /**
     * Cria um novo grupo
     */
    async createGroup(groupData: Partial<IGroup>): Promise<IGroup> {
        const response = await api.post<IGroup>('/groups', groupData);
        return response.data;
    },

    /**
     * Atualiza um grupo existente
     */
    async updateGroup(groupId: string, groupData: Partial<IGroup>): Promise<IGroup> {
        const response = await api.put<IGroup>(`/groups/${groupId}`, groupData);
        return response.data;
    },

    /**
     * Deleta um grupo
     */
    async deleteGroup(groupId: string): Promise<void> {
        await api.delete(`/groups/${groupId}`);
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
    async removeDashboardFromGroup(groupId: string, dashboardId: string): Promise<void> {
        await api.delete(`/app/groups/${groupId}/dashboards/${dashboardId}`);
    },

    /**
     * Adiciona um dashboard a um grupo
     */
    async addDashboardToGroup(groupId: string, dashboardId: string): Promise<void> {
        await api.post(`/app/groups/${groupId}/dashboards/${dashboardId}`, { dashboardId });
    }
};

