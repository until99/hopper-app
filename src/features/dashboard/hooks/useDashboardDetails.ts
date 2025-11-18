import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';

export const useDashboardDetails = (groupId: string | undefined, dashboardId: string | undefined) => {
    const [dashboard, setDashboard] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pipelineAssociated, setPipelineAssociated] = useState<string | null>(null);

    const fetchDashboard = useCallback(async () => {
        if (!groupId || !dashboardId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            // Buscar detalhes do dashboard
            const data = await dashboardService.fetchDashboardDetails(groupId, dashboardId);
            setDashboard(data);
            
            // Buscar pipeline associado
            const pipelineId = await dashboardService.fetchPipelineAssociation(dashboardId);
            setPipelineAssociated(pipelineId);
        } catch (err) {
            setError('Erro ao carregar detalhes do dashboard');
            console.error('Error fetching dashboard details:', err);
        } finally {
            setLoading(false);
        }
    }, [groupId, dashboardId]);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    return {
        dashboard,
        loading,
        error,
        pipelineAssociated,
        refetch: fetchDashboard
    };
};
