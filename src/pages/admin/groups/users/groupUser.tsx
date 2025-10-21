import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AddUsersToGroupModal from "../../../../components/modals/group/AddUsersToGroupModal";


interface IUser {
    id: string;
    user_id: string;
    username: string;
    email: string;
    role: string;
    active: boolean;
    created: string;
    updated: string;
}

export default function GroupUsers() {
    const { groupId } = useParams()

    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [groupName, setGroupName] = useState<string>("");

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        fetchGroupInfo();
        fetchGroupUsers();
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

    const fetchGroupUsers = async () => {
        try {
            const response = await axios.get<IUser[]>(
                `${import.meta.env.VITE_API_URL}/app/groups/${groupId}/users`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                }
            );

            if (response.status !== 200) {
                throw new Error("Failed to fetch group users")
            }

            setLoading(false);
            setUsers(response.data);

        }
        catch (error) {
            console.error("Error fetching group users:", error);
        }
    }

    const handleRemoveUser = async (userId: string) => {
        if (!confirm("Are you sure?")) {
            return;
        }

        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_API_URL}/app/groups/${groupId}/users/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                }
            );

            if (response.status === 200 || response.data.message) {
                fetchGroupUsers();
            }

            console.log("usuário removido");
            
        } catch (error: any) {
            console.error("Error removing user from group:", error);
        }
    }

    return <>
        {/* Modals */}
        <AddUsersToGroupModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            groupId={groupId || null}
            groupName={groupName}
            onUsersAdded={fetchGroupUsers}
        />

        <h1>Group Users</h1>

        <button onClick={() => setIsCreateModalOpen(true)}>Adicionar Usuários</button>

        <br /><br />

        <table>
            <thead>
                <tr>
                    <th>User ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {loading ? (
                    <tr>
                        <td colSpan={6}>Loading...</td>
                    </tr>
                ) : (users && users.map(user => (
                    <tr key={user.id}>
                        <td>{user.user_id}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{user.active ? "Active" : "Inactive"}</td>
                        <td>
                            <button onClick={() => handleRemoveUser(user.user_id)}>
                                Remover
                            </button>
                        </td>
                    </tr>
                )))}
            </tbody>
        </table>
    </>
}