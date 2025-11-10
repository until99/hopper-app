import { useState } from "react"
import { useUsers } from "../hooks/useUsers"

import CreateUserModal from "../modals/CreateUserModal"
import EditUserModal from "../modals/EditUserModal"
import DeleteUserModal from "../modals/DeleteUserModal"


export default function CrudUsers() {
    const { users, loading, refetch } = useUsers();

    const [editModalOpen, setEditModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [createModalOpen, setCreateModalOpen] = useState(false)

    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
    const [selectedUsername, setSelectedUsername] = useState("")

    function openUserEditModal(userId: string, username: string) {
        return () => {
            setSelectedUserId(userId)
            setSelectedUsername(username)
            setEditModalOpen(true)
        }
    }

    function openUserDeleteModal(userId: string, username: string) {
        return () => {
            setSelectedUserId(userId)
            setSelectedUsername(username)
            setDeleteModalOpen(true)
        }
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
        <>
            <h1>Users</h1>
            <button onClick={openUserCreateModal}>Create New User</button>

            <br /><br />
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
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
                            <td colSpan={6}>Thinking...</td>
                        </tr>
                    ) : (
                        users?.users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>{user.active ? "Active" : "Inactive"}</td>
                                <td>
                                    <button onClick={openUserEditModal(user.id, user.username)}>Edit</button>
                                    <button onClick={openUserDeleteModal(user.id, user.username)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

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
        </>
    )
}