import { useState } from 'react';
import { dashboardService } from '../services/dashboardService';

export const usePipelineActions = () => {
    const [refreshLoading, setRefreshLoading] = useState<{ [dashboardId: string]: boolean }>({});
    const [refreshError, setRefreshError] = useState<{ [dashboardId: string]: string }>({});
    const [unlinkLoading, setUnlinkLoading] = useState<{ [dashboardId: string]: boolean }>({});
    const [unlinkError, setUnlinkError] = useState<{ [dashboardId: string]: string }>({});

    const runPipeline = async (dashboardId: string) => {
        setRefreshLoading(prev => ({ ...prev, [dashboardId]: true }));
        setRefreshError(prev => ({ ...prev, [dashboardId]: '' }));
        try {
            await dashboardService.runPipeline(dashboardId);
            setRefreshLoading(prev => ({ ...prev, [dashboardId]: false }));
        } catch {
            setRefreshLoading(prev => ({ ...prev, [dashboardId]: false }));
            setRefreshError(prev => ({ ...prev, [dashboardId]: 'Erro ao rodar pipeline.' }));
        }
    };

    const unlinkPipeline = async (dashboardId: string, onSuccess?: () => void) => {
        setUnlinkLoading(prev => ({ ...prev, [dashboardId]: true }));
        setUnlinkError(prev => ({ ...prev, [dashboardId]: '' }));
        try {
            await dashboardService.unlinkPipeline(dashboardId);
            setUnlinkLoading(prev => ({ ...prev, [dashboardId]: false }));
            onSuccess?.();
        } catch {
            setUnlinkLoading(prev => ({ ...prev, [dashboardId]: false }));
            setUnlinkError(prev => ({ ...prev, [dashboardId]: 'Erro ao desvincular pipeline.' }));
        }
    };

    return {
        runPipeline,
        unlinkPipeline,
        refreshLoading,
        refreshError,
        unlinkLoading,
        unlinkError
    };
};
