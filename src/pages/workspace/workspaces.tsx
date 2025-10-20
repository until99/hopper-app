import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import type { IWorkspace } from "../../interfaces/dashboard"
import axios from "axios"



function Workspaces() {
    const [workspaces, setWorkspaces] = useState<IWorkspace[]>([])
    const [loading, setLoading] = useState(true)

    const handleLogout = () => {
        localStorage.removeItem('authToken')
        localStorage.removeItem('userId')

        window.location.href = '/login'

    }

    useEffect(() => {
        axios({
            method: "get",
            url: `${import.meta.env.VITE_API_URL}/groups`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
            .then(function (response) {

                if (response.status !== 200) {
                    throw new Error("Failed to fetch groups")
                }

                else {
                    setWorkspaces(response.data.groups)
                    setLoading(false);
                }

            })
            .catch(function (error) {
                console.error("Erro ao requisitar grupos: ", error);
            });
    }, [])

    return (
        <>
            <nav>
                <button onClick={handleLogout}>Logout</button>
            </nav>

            <h1>Workspaces</h1>
            <ul>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    workspaces.map((workspace) => (
                        <li key={workspace.id}>
                            <Link to={`/workspaces/${workspace.id}/dashboards`}>
                                <h2>{workspace.name}</h2>
                            </Link>
                        </li>
                    ))
                )}
            </ul>
        </>
    )
}

export default Workspaces
