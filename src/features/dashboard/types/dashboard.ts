export interface Dashboard {
    id: string;
    name: string;
    datasetId: string;
    description: string | null;
    groupId: string;
    groupName: string;
}

// Alias para compatibilidade
export type IDashboard = Dashboard;

export interface DashboardsResponse {
    dashboards: Dashboard[];
}

export interface PipelineAssociation {
    [dashboardId: string]: string | null;
}
