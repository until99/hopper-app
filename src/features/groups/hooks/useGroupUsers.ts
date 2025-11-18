import { useState, useEffect, useCallback } from 'react';
import { groupsService } from '../services/groupsApiService';

export const useGroupUsers = (groupId: string | undefined) => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        if (!groupId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await groupsService.fetchGroupUsers(groupId);
            setUsers(data);
        } catch (err) {
            setError('Erro ao carregar usuários do grupo');
            console.error('Error fetching group users:', err);
        } finally {
            setLoading(false);
        }
    }, [groupId]);

    const removeUser = async (userId: string) => {
        if (!groupId) return;
        
        try {
            await groupsService.removeUserFromGroup(groupId, userId);
            await fetchUsers(); // Recarrega a lista
        } catch (err) {
            console.error('Error removing user from group:', err);
            throw err;
        }
    };

    useEffect(() => {
        let isMounted = true;

        const loadUsers = async () => {
            if (!groupId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const data = await groupsService.fetchGroupUsers(groupId);
                
                if (isMounted) {
                    setUsers(data);
                }
            } catch (err) {
                if (isMounted) {
                    setError('Erro ao carregar usuários do grupo');
                    console.error('Error fetching group users:', err);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadUsers();

        return () => {
            isMounted = false;
        };
    }, [groupId]);

    return {
        users,
        loading,
        error,
        refetch: fetchUsers,
        removeUser
    };
};
