import axios from "axios";
import { useEffect, useState } from "react";
import DeleteDashboardModal from "../../../components/modals/dashboard/DeleteDashboardModal";

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
                            <td colSpan={4}>Thinking...</td>
                        </tr>
                    ) : dashboards.length === 0 ? (
                        <tr>
                            <td colSpan={4}>No dashboards found</td>
                        </tr>
                    ) : (
                        dashboards.map(dashboard => (
                            <tr key={dashboard.id}>
                                <td>{dashboard.id}</td>
                                <td>{dashboard.name}</td>
                                <td>{dashboard.groupId}</td>
                                <td>{dashboard.groupName}</td>
                                <td>
                                    <button onClick={() => handleDeleteClick(dashboard.id, dashboard.name, dashboard.groupId, dashboard.datasetId)}>Delete</button>
                                </td>
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
