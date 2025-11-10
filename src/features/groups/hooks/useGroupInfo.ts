import { useState, useEffect, useCallback } from 'react';
import { groupsService } from '../services/groupsApiService';
import type { IGroup } from '../types/Group';

export const useGroupInfo = (groupId: string | undefined) => {
    const [group, setGroup] = useState<IGroup | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchGroup = useCallback(async () => {
        if (!groupId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await groupsService.fetchGroupInfo(groupId);
            setGroup(data);
        } catch (err) {
            setError('Erro ao carregar informações do grupo');
            console.error('Error fetching group info:', err);
        } finally {
            setLoading(false);
        }
    }, [groupId]);

    useEffect(() => {
        let isMounted = true;

        const loadGroup = async () => {
            if (!groupId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const data = await groupsService.fetchGroupInfo(groupId);
                
                if (isMounted) {
                    setGroup(data);
                }
            } catch (err) {
                if (isMounted) {
                    setError('Erro ao carregar informações do grupo');
                    console.error('Error fetching group info:', err);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadGroup();

        return () => {
            isMounted = false;
        };
    }, [groupId]);

    return {
        group,
        loading,
        error,
        refetch: fetchGroup
    };
};
