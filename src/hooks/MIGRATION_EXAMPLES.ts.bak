/**
 * Este arquivo demonstra como migrar hooks existentes para usar o novo sistema de cache global
 * 
 * ANTES: Cada componente fazia suas próprias requisições
 * DEPOIS: Usa o sistema centralizado com cache
 */

// ============================================
// EXEMPLO 1: Hook Simples - Buscar Grupos
// ============================================

// ❌ ANTIGO (sem cache, requisições duplicadas)
/*
import { useState, useEffect } from 'react';
import { groupsService } from '../services/groupsApiService';

export const useFetchGroups = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await groupsService.fetchGroups();
            setGroups(data);
            setLoading(false);
        };
        fetchData();
    }, []);

    return { groups, loading };
};
*/

// ✅ NOVO (com cache global)
import { useFetchGroups as useGlobalFetchGroups } from '../../../hooks/useDataFetch';

export const useFetchGroups = () => {
    // Simplesmente retorna o hook global que já gerencia cache
    return useGlobalFetchGroups();
};

// ============================================
// EXEMPLO 2: Hook com Refetch
// ============================================

// ❌ ANTIGO
/*
export const useGroupsWithRefetch = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    const refetch = async () => {
        setLoading(true);
        const data = await groupsService.fetchGroups();
        setGroups(data);
        setLoading(false);
    };

    useEffect(() => {
        refetch();
    }, []);

    return { groups, loading, refetch };
};
*/

// ✅ NOVO
import { useEffect } from 'react';

export const useGroupsWithRefetch = () => {
    const { groups, loading, fetchGroups } = useGlobalFetchGroups();

    useEffect(() => {
        fetchGroups(); // Usa cache se disponível
    }, [fetchGroups]);

    const refetch = () => fetchGroups(true); // force = true para ignorar cache

    return { groups, loading, refetch };
};

// ============================================
// EXEMPLO 3: Componente Usando o Hook
// ============================================

// ✅ USO NO COMPONENTE
/*
import { useGroupsWithRefetch } from '../hooks/useFetchGroups';

export default function GroupsPage() {
    const { groups, loading, refetch } = useGroupsWithRefetch();

    const handleCreateGroup = async (data) => {
        await createGroup(data);
        // Recarrega dados após criar
        refetch();
    };

    if (loading) return <Loading />;

    return (
        <div>
            <button onClick={refetch}>Refresh</button>
            <button onClick={handleCreateGroup}>Create</button>
            {groups.map(g => <GroupCard key={g.id} group={g} />)}
        </div>
    );
}
*/

// ============================================
// EXEMPLO 4: Acesso Direto ao Store
// ============================================

// Para casos onde você só precisa ler os dados sem buscar
import { useDataStore } from '../../../store/dataStore';

export const useGroupsFromStore = () => {
    // Acessa direto do cache, sem fazer requisição
    const groups = useDataStore(state => state.groups);
    const loading = useDataStore(state => state.groupsState.loading);
    const error = useDataStore(state => state.groupsState.error);

    return { groups, loading, error };
};

// ============================================
// EXEMPLO 5: Invalidar Cache após Mutação
// ============================================

export const useCreateGroup = () => {
    const { fetchGroups } = useGlobalFetchGroups();

    const createGroup = async (data: any) => {
        try {
            // 1. Cria o grupo
            await groupsService.createGroup(data);
            
            // 2. Invalida cache e recarrega
            await fetchGroups(true);
            
            return { success: true };
        } catch (error) {
            return { success: false, error };
        }
    };

    return { createGroup };
};

// ============================================
// EXEMPLO 6: Múltiplos Recursos
// ============================================

import { useFetchDashboards } from '../../../hooks/useDataFetch';
import { useFetchUsers } from '../../../hooks/useDataFetch';

export const useAdminData = () => {
    const { groups, loading: groupsLoading } = useGlobalFetchGroups();
    const { dashboards, loading: dashboardsLoading } = useFetchDashboards();
    const { users, loading: usersLoading } = useFetchUsers();

    const loading = groupsLoading || dashboardsLoading || usersLoading;

    return {
        groups,
        dashboards,
        users,
        loading
    };
};

// ============================================
// VANTAGENS DO NOVO SISTEMA
// ============================================

/*
✅ Cache Automático
   - Dados salvos no localStorage
   - Válido por 5 minutos (configurável)
   - Não refaz requisições desnecessárias

✅ Fila de Requisições
   - Evita requisições duplicadas
   - Processa com prioridade
   - Delay entre requisições

✅ Estado Global
   - Dados compartilhados entre componentes
   - Menos código duplicado
   - Melhor performance

✅ Persistência
   - Dados sobrevivem ao refresh
   - Melhor UX
   - Menos tempo de loading

✅ Controle Centralizado
   - Fácil de debugar
   - Logs no console
   - Limpeza automática no logout
*/
