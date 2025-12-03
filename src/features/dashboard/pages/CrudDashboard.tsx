import { useState } from "react";
import { ChartBar } from "@phosphor-icons/react";
import { useDashboards } from "../hooks/useDashboards";
import { usePipelineActions } from "../hooks/usePipelineActions";
import { DashboardsTable } from "../components/DashboardsTable";
import DeleteDashboardModal from "../modals/DeleteDashboardModal";

function CrudDashboard() {
    const { dashboards, loading, pipelineAssociation, updatePipelineAssociation } = useDashboards();
    const { runPipeline, unlinkPipeline, refreshLoading, refreshError, unlinkLoading, unlinkError } = usePipelineActions();

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
        setSelectedDashboardDatasetId(null);
        setSelectedDashboardName('');
    };

    const handleDashboardDeleted = () => {
        window.location.reload();
    };

    const handleUnlinkPipeline = (dashboardId: string) => {
        unlinkPipeline(dashboardId, () => {
            updatePipelineAssociation(dashboardId, null);
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8 overflow-hidden">
            <DeleteDashboardModal
                isOpen={deleteModalOpen}
                onClose={handleCloseDeleteModal}
                dashboardId={selectedDashboardId}
                groupId={selectedDashboardGroupId}
                dashboardName={selectedDashboardName}
                datasetId={selectedDashboardDatasetId}
                onDashboardDeleted={handleDashboardDeleted}
            />

            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6 sm:mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
                            <ChartBar className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" weight="bold" />
                            <span>Dashboards Management</span>
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600">Manage all Power BI dashboards and pipeline associations</p>
                    </div>
                </div>

                <DashboardsTable
                    dashboards={dashboards}
                    loading={loading}
                    pipelineAssociation={pipelineAssociation}
                    onDelete={handleDeleteClick}
                    onRunPipeline={runPipeline}
                    onUnlinkPipeline={handleUnlinkPipeline}
                    refreshLoading={refreshLoading}
                    refreshError={refreshError}
                    unlinkLoading={unlinkLoading}
                    unlinkError={unlinkError}
                />
            </div>
        </div>
    );
}

export default CrudDashboard;
