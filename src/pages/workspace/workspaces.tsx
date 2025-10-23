import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

interface IGroup {
    id: string
    name: string
    description: string
    active: boolean
    created: string
    updated: string
}

function Workspaces() {
    const [groups, setGroups] = useState<[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        const userId = user ? user.id : null

        if (userId) {
            axios({
                method: "get",
                url: `${import.meta.env.VITE_API_URL}/app/users/${userId}/groups`,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            })
                .then(function (response) {

                    if (response.status !== 200) {
                        console.error("Erro ao requisitar grupos: ", response);
                    }

                    else {
                        const active_groups = response.data.groups.filter((group: IGroup) => group.active);

                        setGroups(active_groups);
                        setLoading(false);
                    }

                })
                .catch(function (error) {
                    console.error("Erro ao requisitar grupos: ", error);
                });
        }
    }, []);

    return (
        <>
            <h1>Workspaces</h1>
            <ul>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    groups.map((group: IGroup) => (
                        <li key={group.id}>
                            <Link to={`${group.id}/dashboards`}>
                                <h2>{group.name}</h2>
                            </Link>
                        </li>
                    ))
                )}
            </ul>
        </>
    )
}

export default Workspaces
