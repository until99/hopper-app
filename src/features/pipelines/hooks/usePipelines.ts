import { useEffect, useCallback } from 'react';
import { useFetchPipelines as useGlobalFetchPipelines } from '../../../hooks/useDataFetch';

export const usePipelines = () => {
    const { pipelines, loading, error, fetchPipelines: globalFetchPipelines } = useGlobalFetchPipelines();

    // Carrega dados apenas se necessário (usa cache se disponível)
    useEffect(() => {
        let isMounted = true;

        const loadPipelines = async () => {
            if (isMounted) {
                await globalFetchPipelines();
            }
        };

        loadPipelines();

        return () => {
            isMounted = false;
        };
    }, [globalFetchPipelines]);

    // Função para forçar reload
    const refetch = useCallback(async () => {
        await globalFetchPipelines(true); // force = true
    }, [globalFetchPipelines]);

    return {
        pipelines,
        loading,
        error,
        refetch,
    };
};
