import { api } from "../../../lib/axios";
import type { IGroup } from "../../groups/types/Group";

export const workspaceService = {
  async fetchUserGroups(
    userId: string | null,
    isAdmin: boolean = false
  ): Promise<IGroup[]> {
    try {
      let response;

      // Se for admin, busca todos os grupos
      if (isAdmin) {
        response = await api.get("/app/groups");
      } else if (userId) {
        // Se não for admin, busca apenas grupos do usuário
        response = await api.get(`/app/users/${userId}/groups`);
      } else {
        return [];
      }

      if (response.status !== 200) {
        throw new Error("Erro ao carregar grupos do usuário");
      }

      // Verifica se response.data tem groups, items ou se é um array direto
      let groups: IGroup[] = [];

      if (response.data?.groups && Array.isArray(response.data.groups)) {
        groups = response.data.groups;
      } else if (response.data?.items && Array.isArray(response.data.items)) {
        groups = response.data.items;
      } else if (Array.isArray(response.data)) {
        groups = response.data;
      } else {
        console.warn("Unexpected response format:", response.data);
        return [];
      }

      const filteredGroups = groups.filter((group: IGroup) => group.active);
      return filteredGroups;
    } catch (error) {
      console.error("Error in workspaceService:", error);
      throw error;
    }
  },
};
