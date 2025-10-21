import axios from "axios"
import { useEffect, useState } from "react"
import { type IUser } from "../../../interfaces/user"

import Navbar from "../../../components/layout/Navbar"

import CreateUserModal from "../../../components/modals/user/CreateUserModal"
import EditUserModal from "../../../components/modals/user/EditUserModal"
import DeleteUserModal from "../../../components/modals/user/DeleteUserModal"


interface IUserResponse {
    page: number
    perPage: number
    totalPages: number
    totalItems: number
    users: IUser[]
}

export default function CrudUsers() {
    const [users, setUsers] = useState<IUserResponse>()
    const [loading, setLoading] = useState(true)

    const [editModalOpen, setEditModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [createModalOpen, setCreateModalOpen] = useState(false)

    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
    const [selectedUsername, setSelectedUsername] = useState("")

    function fetchUsers(page = 1, limit = 10): IUserResponse | void {
        axios({
            method: "get",
            url: `${import.meta.env.VITE_API_URL}/users?sort=-created,id&page=${page}&limit=${limit}`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        }).then((response) => {

            if (response.status !== 200) {
                throw new Error("Failed to fetch users")
            }

            else {
                console.log(response.data);

                setLoading(false)
                setUsers(response.data)
            }
        })
            .catch((error) => {
                console.error("Error fetching users", error)
                setLoading(false)
            });
    }

    useEffect(() => {
        fetchUsers();
    }, [])

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
        fetchUsers()
    }

    function handleUserDeleted() {
        fetchUsers()
    }

    function handleUserCreated() {
        fetchUsers()
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