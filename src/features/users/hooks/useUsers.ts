import { useEffect, useCallback } from 'react';
import { useFetchUsers as useGlobalFetchUsers } from '../../../hooks/useDataFetch';
import type { IUserResponse } from '../services/usersService';

export const useUsers = () => {
    const { users: usersList, loading, error, fetchUsers: globalFetchUsers } = useGlobalFetchUsers();

    // Carrega dados apenas se necessário (usa cache se disponível)
    useEffect(() => {
        let isMounted = true;

        const loadUsers = async () => {
            if (isMounted) {
                await globalFetchUsers();
            }
        };

        loadUsers();

        return () => {
            isMounted = false;
        };
    }, [globalFetchUsers]);

    // Função para forçar reload
    const refetch = useCallback(async () => {
        await globalFetchUsers(true); // force = true
    }, [globalFetchUsers]);

    // Formata resposta para manter compatibilidade com código existente
    const users: IUserResponse = {
        page: 1,
        perPage: 1000,
        totalPages: 1,
        totalItems: usersList.length,
        users: usersList,
    };

    return {
        users,
        loading,
        error,
        refetch,
    };
};
