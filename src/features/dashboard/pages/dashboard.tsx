import { useState } from "react";
import { useDashboards } from "../hooks/useDashboards";
import { usePipelineActions } from "../hooks/usePipelineActions";
import DeleteDashboardModal from "../modals/DeleteDashboardModal";

function CrudDashboard() {
    const { dashboards, loading, pipelineAssociation, refetch, updatePipelineAssociation } = useDashboards();
    
    const {
        runPipeline,
        unlinkPipeline,
        refreshLoading,
        refreshError,
        unlinkLoading,
        unlinkError
    } = usePipelineActions();
    
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedDashboardId, setSelectedDashboardId] = useState<string | null>(null);
    const [selectedDashboardGroupId, setSelectedDashboardGroupId] = useState<string | null>(null);
    const [selectedDashboardDatasetId, setSelectedDashboardDatasetId] = useState<string | null>(null);
    const [selectedDashboardName, setSelectedDashboardName] = useState<string>('');

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
        refetch();
    };

    // Handler para rodar pipeline
    const handleRunPipeline = async (dashboardId: string) => {
        await runPipeline(dashboardId);
    };

    // Handler para desvincular dashboard do pipeline
    const handleUnlinkPipeline = async (dashboardId: string) => {
        await unlinkPipeline(dashboardId, () => {
            updatePipelineAssociation(dashboardId, null);
        });
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
