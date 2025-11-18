import { useState } from "react";
import { useFetchGroups } from "../hooks/useFetchGroups";
import CreateGroupModal from "../modals/CreateGroupModal";
import EditGroupModal from "../modals/EditGroupModal";
import DeleteGroupModal from "../modals/DeleteGroupModal";
import { Link } from "react-router-dom";

export default function Groups() {
    const { groups, loading, refetch } = useFetchGroups();

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const [selectedGroupName, setSelectedGroupName] = useState("");

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
        refetch();
    };

    const handleGroupUpdated = () => {
        refetch();
    };

    const handleGroupDeleted = () => {
        refetch();
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