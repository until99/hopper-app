import { useEffect, useCallback } from 'react';
import { useFetchGroups as useGlobalFetchGroups } from '../../../hooks/useDataFetch';
import { useState } from 'react';
import { groupsService } from '../services/groupsApiService';
import type { IGroup } from '../types/Group';

export const useFetchGroups = () => {
    const { groups, loading, error, fetchGroups: globalFetchGroups } = useGlobalFetchGroups();

    // Carrega dados apenas se necessário (usa cache se disponível)
    useEffect(() => {
        let isMounted = true;

        const loadGroups = async () => {
            if (isMounted) {
                await globalFetchGroups();
            }
        };

        loadGroups();

        return () => {
            isMounted = false;
        };
    }, [globalFetchGroups]);

    // Função para forçar reload
    const refetch = useCallback(async () => {
        await globalFetchGroups(true); // force = true
    }, [globalFetchGroups]);

    return {
        groups,
        loading,
        error,
        refetch,
    };
};

export const useUserGroups = (userId: string | null) => {
    const [groups, setGroups] = useState<IGroup[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUserGroups = useCallback(async () => {
        if (!userId) return;
        
        try {
            setLoading(true);
            setError(null);
            const data = await groupsService.fetchUserGroups(userId);
            setGroups(data);
        } catch (err) {
            setError('Erro ao carregar grupos do usuário');
            console.error('Error fetching user groups:', err);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchUserGroups();
    }, [fetchUserGroups]);

    return {
        groups,
        loading,
        error,
        refetch: fetchUserGroups
    };
};
