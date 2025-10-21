import axios from "axios";
import { useState, useEffect } from "react";
import type { IGroup, IGroupsApiResponse } from "../../../interfaces/group";
import CreateGroupModal from "../../../components/modals/group/CreateGroupModal";
import EditGroupModal from "../../../components/modals/group/EditGroupModal";
import DeleteGroupModal from "../../../components/modals/group/DeleteGroupModal";
import { Link } from "react-router-dom";

export default function Groups() {
    const [groups, setGroups] = useState<IGroup[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const [selectedGroupName, setSelectedGroupName] = useState("");

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await axios.get<IGroupsApiResponse>(
                `${import.meta.env.VITE_API_URL}/app/groups`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                }
            );

            if (response.status !== 200) {
                throw new Error("Failed to fetch groups")
            }

            setLoading(false);
            setGroups(response.data.items);

        } catch (error) {
            setLoading(false);
            console.error("Error fetching groups:", error);
        }
    };

    const handleOpenEditModal = (groupId: string, groupName: string) => {
        setSelectedGroupId(groupId);
        setSelectedGroupName(groupName);
        setIsEditModalOpen(true);
    };

    const handleOpenDeleteModal = (groupId: string, groupName: string) => {
        setSelectedGroupId(groupId);
        setSelectedGroupName(groupName);
        setIsDeleteModalOpen(true);
    };

    const handleCloseModals = () => {
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
        setSelectedGroupId(null);
        setSelectedGroupName("");
    };

    const handleGroupCreated = () => {
        fetchGroups();
    };

    const handleGroupUpdated = () => {
        fetchGroups();
    };

    const handleGroupDeleted = () => {
        fetchGroups();
    };

    return <>
        {/* Modals */}
        <CreateGroupModal
            isOpen={isCreateModalOpen}
            onClose={handleCloseModals}
            onGroupCreated={handleGroupCreated}
        />
        <EditGroupModal
            isOpen={isEditModalOpen}
            onClose={handleCloseModals}
            groupId={selectedGroupId}
            onGroupUpdated={handleGroupUpdated}
        />
        <DeleteGroupModal
            isOpen={isDeleteModalOpen}
            onClose={handleCloseModals}
            groupId={selectedGroupId}
            groupName={selectedGroupName}
            onGroupDeleted={handleGroupDeleted}
        />

        <h1>Groups Management</h1>

        <button onClick={() => setIsCreateModalOpen(true)}>Create New Group</button>

        <br /><br />

        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Active</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {loading ? (
                    <tr>
                        <td colSpan={5}>Loading...</td>
                    </tr>
                ) : (
                    groups.map(group => (
                        <tr key={group.id}>
                            <td>{group.id}</td>
                            <td>{group.name}</td>
                            <td>{group.description}</td>
                            <td>{group.active ? "Active" : "Inactive"}</td>
                            <td style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                <Link to={`/admin/groups/${group.id}/dashboards`}>
                                    Dashboards
                                </Link>
                                <Link to={`/admin/groups/${group.id}/users`}>
                                    Users
                                </Link>
                                <p>|</p>
                                <button onClick={() => handleOpenEditModal(group.id, group.name)}>
                                    Edit
                                </button>
                                <button onClick={() => handleOpenDeleteModal(group.id, group.name)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table >
    </>
}