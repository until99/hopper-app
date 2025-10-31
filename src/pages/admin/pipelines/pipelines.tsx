import axios from "axios";
import { useState, useEffect } from "react";
import type { IDashboard } from "../../../interfaces/dashboard";
import LinkDashboardModal from "../../../components/modals/pipeline/LinkDashboardModal";


export interface DagPipeline {
    id: string;
    description: string;
    timetable_description: string;
}

export default function Pipelines() {
    const [pipelines, setPipelines] = useState<DagPipeline[]>([]);
    const [dashboards, setDashboards] = useState<IDashboard[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [isLinkDashboardModalOpen, setIsLinkDashboardModalOpen] = useState(false);
    const [selectedPipelineId, setSelectedPipelineId] = useState<string | null>(null);

    useEffect(() => {
        fetchPipelines();
    }, []);

    useEffect(() => {
        if (isLinkDashboardModalOpen) {
            fetchDashboards();
        }
    }, [isLinkDashboardModalOpen]);

    const fetchDashboards = async () => {
        try {
            const response = await axios.get<{ dashboards: IDashboard[] }>(
                `${import.meta.env.VITE_API_URL}/dashboards`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                }
            );
            const dashboardsArr = response.data.dashboards || response.data || [];
            setDashboards(dashboardsArr);
        } catch (error) {
            setDashboards([]);
            console.error("Error fetching dashboards:", error);
        }
    };

    const fetchPipelines = async () => {
        try {
            const response = await axios.get<{ dags: DagPipeline[] }>(
                `${import.meta.env.VITE_API_URL}/pipelines`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                }
            );
            setLoading(false);
            setPipelines(response.data.dags);
        } catch (error) {
            setLoading(false);
            console.error("Error fetching pipelines:", error);
        }
    };

    const handleOpenLinkDashboardModal = (pipelineId: string) => {
        setSelectedPipelineId(pipelineId);
        setIsLinkDashboardModalOpen(true);
    };

    const handleCloseModals = () => {
        setIsLinkDashboardModalOpen(false);
        setSelectedPipelineId(null);
    };

    const handleDashboardLinked = () => { fetchPipelines(); };

    return (
        <>
            <LinkDashboardModal
                isOpen={isLinkDashboardModalOpen}
                onClose={handleCloseModals}
                pipelineId={selectedPipelineId}
                dashboards={dashboards}
                onDashboardLinked={handleDashboardLinked}
            />

            <h1>Pipelines Management</h1>
            <a href={import.meta.env.VITE_AIRFLOW_URL} target="_blank" rel="noopener noreferrer">
                Manage Pipelines
            </a>
            <br /><br />
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Description</th>
                        <th>Timetable</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={4}>Loading...</td>
                        </tr>
                    ) : (
                        pipelines.map(pipeline => (
                            <tr key={pipeline.id}>
                                <td>{pipeline.id}</td>
                                <td>{pipeline.description}</td>
                                <td>{pipeline.timetable_description}</td>
                                <td style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                    <button onClick={() => handleOpenLinkDashboardModal(pipeline.id)}>Vincular Dashboard</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </>
    );
}
