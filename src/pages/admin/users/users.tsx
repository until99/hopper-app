import axios from "axios"
import { useEffect, useState } from "react"
import { type IUser } from "../../../interfaces/user"

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

    return (
        <>
            <h1>Users</h1>
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
                            <td colSpan={6}>Loading...</td>
                        </tr>
                    ) : (
                        users?.users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>{user.active}</td>
                                <td>
                                    <button>Edit</button>
                                    <button>Delete</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </>
    )
}