import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AddDashboardsToGroupModal from "../../../../components/modals/group/AddDashboardsToGroupModal";

interface IDashboard {
    id: string;
    datasetId: string;
    description: string | null;
    groupId: string;
    groupName: string;
    name: string;
}

export default function GroupDashboards() {
    const { groupId } = useParams();

    const [dashboards, setDashboards] = useState<IDashboard[]>([]);
    const [loading, setLoading] = useState(true);
    const [groupName, setGroupName] = useState<string>("");

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        fetchGroupInfo();
        fetchGroupDashboards();
    }, [groupId]);

    const fetchGroupInfo = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/app/groups/${groupId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                }
            );

            if (response.status === 200) {
                setGroupName(response.data.name || "Grupo");
            }
        }
        catch (error) {
            console.error("Error fetching group info:", error);
            setGroupName("Grupo");
        }
    }

    const fetchGroupDashboards = async () => {
        try {
            const response = await axios.get<IDashboard[]>(
                `${import.meta.env.VITE_API_URL}/app/groups/${groupId}/dashboards`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                }
            );

            if (response.status !== 200) {
                throw new Error("Failed to fetch group dashboards")
            }

            setLoading(false);
            setDashboards(response.data);
        }
        catch (error) {
            console.error("Error fetching group dashboards:", error);
        }
    }

    const handleRemoveDashboard = async (dashboardId: string) => {
        if (!confirm("Are you sure?")) {
            return;
        }

        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_API_URL}/app/groups/${groupId}/dashboards/${dashboardId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                }
            );

            if (response.status === 200) {
                fetchGroupDashboards();
            }
        } catch (error: any) {
            console.error("Error removing dashboard from group:", error);
            alert("Failed to remove dashboard from group");
        }
    }

    return <>
        {/* Modals */}
        <AddDashboardsToGroupModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            groupId={groupId || null}
            groupName={groupName}
            onDashboardsAdded={fetchGroupDashboards}
        />

        <h1>Group Dashboards</h1>

        <button onClick={() => setIsCreateModalOpen(true)}>Adicionar Dashboards</button>

        <br /><br />

        <table>
            <thead>
                <tr>
                    <th>Dashboard ID</th>
                    <th>Name</th>
                    <th>Group</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {loading ? (
                    <tr>
                        <td colSpan={5}>Loading...</td>
                    </tr>
                ) : (dashboards && dashboards.map(dashboard => (
                    <tr key={dashboard.id}>
                        <td>{dashboard.id}</td>
                        <td>{dashboard.name}</td>
                        <td>{dashboard.groupName}</td>
                        <td>
                            <button onClick={() => handleRemoveDashboard(dashboard.id)}>
                                Remover
                            </button>
                        </td>
                    </tr>
                )))}
            </tbody>
        </table>
    </>
}