import { useState } from "react"
import { useUsers } from "../hooks/useUsers"
import { UsersTable } from "../components/UsersTable"
import CreateUserModal from "../modals/CreateUserModal"
import EditUserModal from "../modals/EditUserModal"
import DeleteUserModal from "../modals/DeleteUserModal"
import { User } from "@phosphor-icons/react"


export default function CrudUsers() {
    const { users, loading, refetch } = useUsers();

    const [editModalOpen, setEditModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [createModalOpen, setCreateModalOpen] = useState(false)

    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
    const [selectedUsername, setSelectedUsername] = useState("")

    function openUserEditModal(userId: string, username: string) {
        setSelectedUserId(userId)
        setSelectedUsername(username)
        setEditModalOpen(true)
    }

    function openUserDeleteModal(userId: string, username: string) {
        setSelectedUserId(userId)
        setSelectedUsername(username)
        setDeleteModalOpen(true)
    }

    function openUserCreateModal() {
        setCreateModalOpen(true)
    }

    function handleUserUpdated() {
        refetch()
    }

    function handleUserDeleted() {
        refetch()
    }

    function handleUserCreated() {
        refetch()
    }

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2 flex items-center gap-3">
                            <User className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" weight="bold" />
                            Users Management
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600">Manage user accounts and permissions</p>
                    </div>
                    <button 
                        onClick={openUserCreateModal}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors shadow-sm w-full sm:w-auto"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="hidden sm:inline">Create New User</span>
                        <span className="sm:hidden">Create User</span>
                    </button>
                </div>

                <UsersTable
                    users={users?.users || []}
                    loading={loading}
                    onEdit={openUserEditModal}
                    onDelete={openUserDeleteModal}
                />
            </div>

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
        </div>
    )
}