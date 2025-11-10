import { useState, useCallback } from 'react';
import { pipelinesService } from '../services/pipelinesService';
import type { IDashboard } from '../../dashboard/types/dashboard';

export const useDashboards = () => {
    const [dashboards, setDashboards] = useState<IDashboard[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboards = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await pipelinesService.fetchDashboards();
            setDashboards(data);
        } catch (err) {
            setError('Erro ao carregar dashboards');
            console.error('Error fetching dashboards:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        dashboards,
        loading,
        error,
        fetchDashboards
    };
};
