import axios from "axios";
import { useEffect, useState } from "react";
import DeleteDashboardModal from "../../../components/modals/dashboard/DeleteDashboardModal";
import '../../../styles/Modal.css';

interface IDashboardResponse {
    dashboards: Array<{
        id: string;
        name: string;
        datasetId: string;
        description: string;
        groupId: string;
        groupName: string;
    }>;
}

function CrudDashboard() {
    const [dashboards, setDashboards] = useState<IDashboardResponse['dashboards']>([]);
    const [loading, setLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedDashboardId, setSelectedDashboardId] = useState<string | null>(null);
    const [selectedDashboardGroupId, setSelectedDashboardGroupId] = useState<string | null>(null);
    const [selectedDashboardDatasetId, setSelectedDashboardDatasetId] = useState<string | null>(null);
    const [selectedDashboardName, setSelectedDashboardName] = useState<string>('');

    // Pipeline association state
    const [pipelineAssociation, setPipelineAssociation] = useState<{ [dashboardId: string]: string | null }>({});
    const [refreshLoading, setRefreshLoading] = useState<{ [dashboardId: string]: boolean }>({});
    const [refreshError, setRefreshError] = useState<{ [dashboardId: string]: string }>({});
    const [unlinkLoading, setUnlinkLoading] = useState<{ [dashboardId: string]: boolean }>({});
    const [unlinkError, setUnlinkError] = useState<{ [dashboardId: string]: string }>({});

    useEffect(() => {
        fetchDashboards();
    }, []);

    const fetchDashboards = async () => {
        try {
            const response = await axios<IDashboardResponse>({
                method: "get",
                url: `${import.meta.env.VITE_API_URL}/dashboards`,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (response.status !== 200) {
                throw new Error("Failed to fetch dashboards")
            }

            setLoading(false);
            setDashboards(response.data.dashboards);

            // Para cada dashboard, buscar pipeline associado
            response.data.dashboards.forEach(async (dashboard) => {
                try {
                    const assocRes = await axios.get(
                        `${import.meta.env.VITE_API_URL}/app/dashboards/${dashboard.id}/pipeline`,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('authToken')}`
                            }
                        }
                    );
                    if (assocRes.data.items && assocRes.data.items.length > 0) {
                        setPipelineAssociation(prev => ({ ...prev, [dashboard.id]: assocRes.data.items[0].pipeline_id }));
                    } else {
                        setPipelineAssociation(prev => ({ ...prev, [dashboard.id]: null }));
                    }
                } catch {
                    setPipelineAssociation(prev => ({ ...prev, [dashboard.id]: null }));
                }
            });
        } catch (error) {
            setLoading(false);
            console.error("Error fetching dashboards:", error);
        }
    };

    const handleDeleteClick = (dashboardId: string, dashboardName: string, dashboardGroupId: string, dashboardDatasetId: string) => {
        setSelectedDashboardId(dashboardId);
        setSelectedDashboardName(dashboardName);
        setSelectedDashboardGroupId(dashboardGroupId);
        setSelectedDashboardDatasetId(dashboardDatasetId);
        setDeleteModalOpen(true);
    };


    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
        setSelectedDashboardId(null);
        setSelectedDashboardGroupId(null);
        setSelectedDashboardName('');
    };

    const handleDashboardDeleted = () => {
        window.location.reload();
    };

    // Handler para rodar pipeline
    const handleRunPipeline = async (dashboardId: string) => {
        setRefreshLoading(prev => ({ ...prev, [dashboardId]: true }));
        setRefreshError(prev => ({ ...prev, [dashboardId]: '' }));
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/app/dashboards/${dashboardId}/pipeline/refresh`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                }
            );
            setRefreshLoading(prev => ({ ...prev, [dashboardId]: false }));
        } catch (err: any) {
            setRefreshLoading(prev => ({ ...prev, [dashboardId]: false }));
            setRefreshError(prev => ({ ...prev, [dashboardId]: 'Erro ao rodar pipeline.' }));
        }
    };

    // Handler para desvincular dashboard do pipeline
    const handleUnlinkPipeline = async (dashboardId: string) => {
        setUnlinkLoading(prev => ({ ...prev, [dashboardId]: true }));
        setUnlinkError(prev => ({ ...prev, [dashboardId]: '' }));
        try {
            await axios.delete(
                `${import.meta.env.VITE_API_URL}/app/dashboards/${dashboardId}/pipeline`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                }
            );
            setUnlinkLoading(prev => ({ ...prev, [dashboardId]: false }));
            setPipelineAssociation(prev => ({ ...prev, [dashboardId]: null }));
        } catch (err: any) {
            setUnlinkLoading(prev => ({ ...prev, [dashboardId]: false }));
            setUnlinkError(prev => ({ ...prev, [dashboardId]: 'Erro ao desvincular pipeline.' }));
        }
    };

    return (
        <>
            <h1>Dashboards</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Group ID</th>
                        <th>Group Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={5}>Thinking...</td>
                        </tr>
                    ) : dashboards.length === 0 ? (
                        <tr>
                            <td colSpan={5}>No dashboards found</td>
                        </tr>
                    ) : (
                        dashboards.map(dashboard => (
                            <tr key={dashboard.id} style={{ position: 'relative' }}>
                                <td>{dashboard.id}</td>
                                <td>{dashboard.name}</td>
                                <td>{dashboard.groupId}</td>
                                <td>{dashboard.groupName}</td>
                                <td>
                                    <button onClick={() => handleDeleteClick(dashboard.id, dashboard.name, dashboard.groupId, dashboard.datasetId)}>Delete</button>
                                </td>
                                {/* Botão de rodar pipeline no canto inferior esquerdo */}
                                {pipelineAssociation[dashboard.id] && (
                                    <td style={{ position: 'absolute', left: 0, bottom: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        <button
                                            style={{ background: '#1976d2', color: '#fff', borderRadius: 4, padding: '4px 12px', fontSize: 12, margin: 0 }}
                                            onClick={() => handleRunPipeline(dashboard.id)}
                                            disabled={refreshLoading[dashboard.id]}
                                        >
                                            {refreshLoading[dashboard.id] ? 'Rodando...' : 'Rodar Pipeline'}
                                        </button>
                                        <button
                                            style={{ background: '#d32f2f', color: '#fff', borderRadius: 4, padding: '4px 12px', fontSize: 12, margin: 0 }}
                                            onClick={() => handleUnlinkPipeline(dashboard.id)}
                                            disabled={unlinkLoading[dashboard.id]}
                                        >
                                            {unlinkLoading[dashboard.id] ? 'Desvinculando...' : 'Desvincular Pipeline'}
                                        </button>
                                        {refreshError[dashboard.id] && (
                                            <span style={{ color: 'red', fontSize: 12, marginLeft: 8 }}>{refreshError[dashboard.id]}</span>
                                        )}
                                        {unlinkError[dashboard.id] && (
                                            <span style={{ color: 'red', fontSize: 12, marginLeft: 8 }}>{unlinkError[dashboard.id]}</span>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <DeleteDashboardModal
                isOpen={deleteModalOpen}
                onClose={handleCloseDeleteModal}
                dashboardId={selectedDashboardId}
                groupId={selectedDashboardGroupId}
                dashboardName={selectedDashboardName}
                datasetId={selectedDashboardDatasetId}
                onDashboardDeleted={handleDashboardDeleted}
            />
        </>
    )
}

export default CrudDashboard
