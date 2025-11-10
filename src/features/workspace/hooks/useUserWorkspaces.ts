import { useState, useEffect, useCallback } from 'react';
import { workspaceService } from '../services/workspaceService';
import type { IGroup } from '../../groups/types/Group';

export const useUserWorkspaces = (userId: string | null) => {
    const [groups, setGroups] = useState<IGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchGroups = useCallback(async () => {
        if (!userId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await workspaceService.fetchUserGroups(userId);
            setGroups(data);
        } catch (err) {
            setError('Erro ao carregar workspaces');
            console.error('Erro ao requisitar grupos:', err);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        let isMounted = true;

        const loadGroups = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const data = await workspaceService.fetchUserGroups(userId);
                
                if (isMounted) {
                    setGroups(data);
                }
            } catch (err) {
                if (isMounted) {
                    setError('Erro ao carregar workspaces');
                    console.error('Erro ao requisitar grupos:', err);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadGroups();

        return () => {
            isMounted = false;
        };
    }, [userId]);

    return {
        groups,
        loading,
        error,
        refetch: fetchGroups
    };
};
