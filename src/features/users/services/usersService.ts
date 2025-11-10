import { api } from '../../../lib/axios';
import type { IUser } from '../types/user';

export interface IUserResponse {
    page: number;
    perPage: number;
    totalPages: number;
    totalItems: number;
    users: IUser[];
}

export const usersService = {
    /**
     * Busca usuários com paginação
     */
    async fetchUsers(page = 1, limit = 10): Promise<IUserResponse> {
        const response = await api.get<IUserResponse>(
            `/users?sort=-created,id&page=${page}&limit=${limit}`
        );
        return response.data;
    },

    /**
     * Cria um novo usuário
     */
    async createUser(userData: Partial<IUser>): Promise<IUser> {
        const response = await api.post<IUser>('/users', userData);
        return response.data;
    },

    /**
     * Atualiza um usuário existente
     */
    async updateUser(userId: string, userData: Partial<IUser>): Promise<IUser> {
        const response = await api.put<IUser>(`/users/${userId}`, userData);
        return response.data;
    },

    /**
     * Deleta um usuário
     */
    async deleteUser(userId: string): Promise<void> {
        await api.delete(`/users/${userId}`);
    }
};

