import { useState } from "react";
import { UsersThree } from "@phosphor-icons/react";
import { useUsers } from "../hooks/useUsers";
import { UsersTable } from "../components/UsersTable";
import CreateUserModal from "../modals/CreateUserModal";
import EditUserModal from "../modals/EditUserModal";
import DeleteUserModal from "../modals/DeleteUserModal";

export default function CrudUsers() {
    const { users, loading, refetch } = useUsers();

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);

    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [selectedUsername, setSelectedUsername] = useState("");

    const openUserEditModal = (userId: string, username: string) => {
        setSelectedUserId(userId);
        setSelectedUsername(username);
        setEditModalOpen(true);
    };

    const openUserDeleteModal = (userId: string, username: string) => {
        setSelectedUserId(userId);
        setSelectedUsername(username);
        setDeleteModalOpen(true);
    };

    const openUserCreateModal = () => {
        setCreateModalOpen(true);
    };

    const handleUserUpdated = () => {
        refetch();
    };

    const handleUserDeleted = () => {
        refetch();
    };

    const handleUserCreated = () => {
        refetch();
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <CreateUserModal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onUserCreated={handleUserCreated}
            />

            <EditUserModal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                userId={selectedUserId}
                onUserUpdated={handleUserUpdated}
            />

            <DeleteUserModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                userId={selectedUserId}
                username={selectedUsername}
                onUserDeleted={handleUserDeleted}
            />

            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                            <UsersThree className="w-8 h-8 text-primary-600" weight="bold" />
                            Users Management
                        </h1>
                        <p className="text-gray-600">Manage user accounts, roles, and permissions</p>
                    </div>
                    <button 
                        onClick={openUserCreateModal}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create New User
                    </button>
                </div>

                <UsersTable
                    users={users?.users || []}
                    loading={loading}
                    onEdit={openUserEditModal}
                    onDelete={openUserDeleteModal}
                />
            </div>
        </div>
    );
}
