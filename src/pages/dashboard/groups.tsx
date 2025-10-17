import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import type { IGroups } from "../../interfaces/dashboard"
import axios from "axios"



function Groups() {
    const [groups, setGroups] = useState<IGroups[]>([])
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
                    setGroups(response.data.groups)
                    setLoading(false);
                }

            })
            .catch(function (error) {
                console.error("Erro ao requisitar grupos: ", error);
            });
    }, [])


    if (loading) {
        return <p>Thinking...</p>
    }

    return (
        <>
            <nav>
                <button onClick={handleLogout}>Logout</button>
            </nav>

            <h1>Groups</h1>
            <ul>
                {groups.map((group) => (
                    <li key={group.id}>
                        <Link to={`/groups/${group.id}/dashboards`}>
                            <h2>{group.name}</h2>
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default Groups
