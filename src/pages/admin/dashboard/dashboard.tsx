import axios from "axios";
import { useEffect, useState } from "react";
import EditDashboardModal from "../../../components/modals/EditDashboardModal";
import DeleteDashboardModal from "../../../components/modals/DeleteDashboardModal";
import Navbar from "../../../components/layout/Navbar";

interface IDashboardResponse {
    dashboards: Array<{
        id: string;
        name: string;
        datasetId: string;
        description: string;
        groupId: string;
    }>;
}

function CrudDashboard() {
    const [dashboards, setDashboards] = useState<IDashboardResponse['dashboards']>([]);
    const [loading, setLoading] = useState(true);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedDashboardId, setSelectedDashboardId] = useState<string | null>(null);
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

    const handleEditClick = (dashboardId: string) => {
        setSelectedDashboardId(dashboardId);
        setEditModalOpen(true);
    };

    const handleDeleteClick = (dashboardId: string, dashboardName: string) => {
        setSelectedDashboardId(dashboardId);
        setSelectedDashboardName(dashboardName);
        setDeleteModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditModalOpen(false);
        setSelectedDashboardId(null);
    };

    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
        setSelectedDashboardId(null);
        setSelectedDashboardName('');
    };

    const handleDashboardUpdated = () => {
        fetchDashboards();
    };

    const handleDashboardDeleted = () => {
        fetchDashboards();
    };

    return (
        <>
            <Navbar />
            <h1>Dashboards</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={4}>Loading...</td>
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
                                <td>
                                    <button onClick={() => handleEditClick(dashboard.id)}>Edit</button>
                                    <button onClick={() => handleDeleteClick(dashboard.id, dashboard.name)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <EditDashboardModal
                isOpen={editModalOpen}
                onClose={handleCloseEditModal}
                dashboardId={selectedDashboardId}
                onDashboardUpdated={handleDashboardUpdated}
            />

            <DeleteDashboardModal
                isOpen={deleteModalOpen}
                onClose={handleCloseDeleteModal}
                dashboardId={selectedDashboardId}
                dashboardName={selectedDashboardName}
                onDashboardDeleted={handleDashboardDeleted}
            />
        </>
    )
}

export default CrudDashboard
