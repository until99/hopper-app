import { useState, useEffect, useCallback } from 'react';
import { useFetchDashboards as useGlobalFetchDashboards } from '../../../hooks/useDataFetch';
import { dashboardService } from '../services/dashboardService';
import type { PipelineAssociation } from '../types/dashboard';

export const useDashboards = () => {
    const { dashboards, loading, error, fetchDashboards: globalFetchDashboards } = useGlobalFetchDashboards();
    const [pipelineAssociation, setPipelineAssociation] = useState<PipelineAssociation>({});

    // Carrega dados apenas se necessário (usa cache se disponível)
    useEffect(() => {
        let isMounted = true;

        const loadDashboards = async () => {
            if (isMounted) {
                await globalFetchDashboards();
            }
        };

        loadDashboards();

        return () => {
            isMounted = false;
        };
    }, [globalFetchDashboards]);

    // Busca associações de pipeline quando dashboards mudam
    useEffect(() => {
        if (dashboards.length > 0) {
            dashboards.forEach(async (dashboard) => {
                const pipelineId = await dashboardService.fetchPipelineAssociation(dashboard.id);
                setPipelineAssociation(prev => ({ ...prev, [dashboard.id]: pipelineId }));
            });
        }
    }, [dashboards]);

    // Função para forçar reload
    const refetch = useCallback(async () => {
        await globalFetchDashboards(true); // force = true
    }, [globalFetchDashboards]);

    const updatePipelineAssociation = (dashboardId: string, pipelineId: string | null) => {
        setPipelineAssociation(prev => ({ ...prev, [dashboardId]: pipelineId }));
    };

    return {
        dashboards,
        loading,
        error,
        pipelineAssociation,
        refetch,
        updatePipelineAssociation
    };
};
