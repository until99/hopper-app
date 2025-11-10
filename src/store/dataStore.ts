import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Dashboard } from '../features/dashboard/types/dashboard';
import type { IGroup } from '../features/groups/types/Group';
import type { IUser } from '../features/users/types/user';
import type { DagPipeline } from '../features/pipelines/types/pipeline';

interface RequestState {
    loading: boolean;
    error: string | null;
    lastFetch: number | null;
}

interface DataState {
    // Data
    dashboards: Dashboard[];
    groups: IGroup[];
    users: IUser[];
    pipelines: DagPipeline[];

    // Request states
    dashboardsState: RequestState;
    groupsState: RequestState;
    usersState: RequestState;
    pipelinesState: RequestState;

    // Actions
    setDashboards: (dashboards: Dashboard[]) => void;
    setGroups: (groups: IGroup[]) => void;
    setUsers: (users: IUser[]) => void;
    setPipelines: (pipelines: DagPipeline[]) => void;

    setDashboardsState: (state: Partial<RequestState>) => void;
    setGroupsState: (state: Partial<RequestState>) => void;
    setUsersState: (state: Partial<RequestState>) => void;
    setPipelinesState: (state: Partial<RequestState>) => void;

    // Cache management
    isCacheValid: (lastFetch: number | null, maxAge?: number) => boolean;
    clearCache: () => void;
    clearAllData: () => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const initialRequestState: RequestState = {
    loading: false,
    error: null,
    lastFetch: null,
};

export const useDataStore = create<DataState>()(
    persist(
        (set) => ({
            // Initial data
            dashboards: [],
            groups: [],
            users: [],
            pipelines: [],

            // Initial states
            dashboardsState: initialRequestState,
            groupsState: initialRequestState,
            usersState: initialRequestState,
            pipelinesState: initialRequestState,

            // Setters
            setDashboards: (dashboards) =>
                set({
                    dashboards,
                    dashboardsState: {
                        loading: false,
                        error: null,
                        lastFetch: Date.now(),
                    },
                }),

            setGroups: (groups) =>
                set({
                    groups,
                    groupsState: {
                        loading: false,
                        error: null,
                        lastFetch: Date.now(),
                    },
                }),

            setUsers: (users) =>
                set({
                    users,
                    usersState: {
                        loading: false,
                        error: null,
                        lastFetch: Date.now(),
                    },
                }),

            setPipelines: (pipelines) =>
                set({
                    pipelines,
                    pipelinesState: {
                        loading: false,
                        error: null,
                        lastFetch: Date.now(),
                    },
                }),

            // State setters
            setDashboardsState: (state) =>
                set((prev) => ({
                    dashboardsState: { ...prev.dashboardsState, ...state },
                })),

            setGroupsState: (state) =>
                set((prev) => ({
                    groupsState: { ...prev.groupsState, ...state },
                })),

            setUsersState: (state) =>
                set((prev) => ({
                    usersState: { ...prev.usersState, ...state },
                })),

            setPipelinesState: (state) =>
                set((prev) => ({
                    pipelinesState: { ...prev.pipelinesState, ...state },
                })),

            // Cache utilities
            isCacheValid: (lastFetch, maxAge = CACHE_DURATION) => {
                if (!lastFetch) return false;
                return Date.now() - lastFetch < maxAge;
            },

            clearCache: () =>
                set({
                    dashboardsState: { ...initialRequestState },
                    groupsState: { ...initialRequestState },
                    usersState: { ...initialRequestState },
                    pipelinesState: { ...initialRequestState },
                }),

            clearAllData: () =>
                set({
                    dashboards: [],
                    groups: [],
                    users: [],
                    pipelines: [],
                    dashboardsState: { ...initialRequestState },
                    groupsState: { ...initialRequestState },
                    usersState: { ...initialRequestState },
                    pipelinesState: { ...initialRequestState },
                }),
        }),
        {
            name: 'hopper-data-storage',
            partialize: (state) => ({
                dashboards: state.dashboards,
                groups: state.groups,
                users: state.users,
                pipelines: state.pipelines,
                dashboardsState: state.dashboardsState,
                groupsState: state.groupsState,
                usersState: state.usersState,
                pipelinesState: state.pipelinesState,
            }),
        }
    )
);
