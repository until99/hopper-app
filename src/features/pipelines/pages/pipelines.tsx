import { useState, useEffect } from "react";
import { GitBranch, ArrowSquareOut } from "@phosphor-icons/react";
import { usePipelines } from "../hooks/usePipelines";
import { useDashboards } from "../hooks/useDashboards";
import { PipelinesTable } from "../components/PipelinesTable";
import LinkDashboardModal from "../modals/LinkDashboardModal";

export default function Pipelines() {
    const { pipelines, loading, refetch } = usePipelines();
    const { dashboards, fetchDashboards } = useDashboards();

    const [isLinkDashboardModalOpen, setIsLinkDashboardModalOpen] = useState(false);
    const [selectedPipelineId, setSelectedPipelineId] = useState<string | null>(null);

    useEffect(() => {
        if (isLinkDashboardModalOpen) {
            fetchDashboards();
        }
    }, [isLinkDashboardModalOpen, fetchDashboards]);

    const handleOpenLinkDashboardModal = (pipelineId: string) => {
        setSelectedPipelineId(pipelineId);
        setIsLinkDashboardModalOpen(true);
    };

    const handleCloseModals = () => {
        setIsLinkDashboardModalOpen(false);
        setSelectedPipelineId(null);
    };

    const handleDashboardLinked = () => {
        refetch();
    };

    const airflowUrl = import.meta.env.VITE_AIRFLOW_URL;

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8 overflow-hidden">
            <LinkDashboardModal
                isOpen={isLinkDashboardModalOpen}
                onClose={handleCloseModals}
                pipelineId={selectedPipelineId}
                dashboards={dashboards}
                onDashboardLinked={handleDashboardLinked}
            />

            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
                            <GitBranch className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" weight="bold" />
                            <span>Pipelines Management</span>
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600">Manage data pipelines and link them to dashboards</p>
                    </div>
                    {airflowUrl && (
                        <a
                            href={airflowUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors shadow-sm w-full sm:w-auto"
                        >
                            <ArrowSquareOut className="w-5 h-5" weight="bold" />
                            <span>Open Airflow</span>
                        </a>
                    )}
                </div>

                <PipelinesTable
                    pipelines={pipelines}
                    loading={loading}
                    onLinkDashboard={handleOpenLinkDashboardModal}
                />
            </div>
        </div>
    );
}
