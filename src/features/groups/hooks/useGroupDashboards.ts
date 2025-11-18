import { useState, useEffect, useCallback } from 'react';
import { groupsService } from '../services/groupsApiService';

export const useGroupDashboards = (groupId: string | undefined) => {
    const [dashboards, setDashboards] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboards = useCallback(async () => {
        if (!groupId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await groupsService.fetchGroupDashboards(groupId);
            setDashboards(data);
        } catch (err) {
            setError('Erro ao carregar dashboards do grupo');
            console.error('Error fetching group dashboards:', err);
        } finally {
            setLoading(false);
        }
    }, [groupId]);

    const removeDashboard = async (dashboardId: string) => {
        if (!groupId) return;
        
        try {
            await groupsService.removeDashboardFromGroup(groupId, dashboardId);
            await fetchDashboards(); // Recarrega a lista
        } catch (err) {
            console.error('Error removing dashboard from group:', err);
            throw err;
        }
    };

    useEffect(() => {
        fetchDashboards();
    }, [fetchDashboards]);

    return {
        dashboards,
        loading,
        error,
        refetch: fetchDashboards,
        removeDashboard
    };
};
