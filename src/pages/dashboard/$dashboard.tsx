import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"

import { type IDashboard } from "../../interfaces/dashboard";
import axios from "axios";

function DashboardId() {
    const { groupId, dashboardId } = useParams()
    const [loading, setLoading] = useState(true)

    const [dashboard, setDashboard] = useState<IDashboard | null>(null)

    useEffect(() => {
        axios({
            method: "get",
            url: `${import.meta.env.VITE_API_URL}/groups/${groupId}/report/${dashboardId}`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
            .then((response) => {

                if (response.status !== 200) {
                    throw new Error("Failed to fetch post")
                }

                if (!response.data) {
                    throw new Error("Post not found")
                }

                else {
                    setDashboard(response.data)
                    setLoading(false)
                }

            })
            .catch((error) => {
                console.error("Error fetching dashboards", error)
                setLoading(false)
            });
    }, [groupId, dashboardId]);


    if (loading) {
        return <div>Thinking...</div>
    }

    if (!dashboard) {
        return <div>Dashboard not found</div>
    }

    return (
        <>
            <h1>Dashboard</h1>
            <ul>
                <li key={dashboard.id} >
                    <h2>{dashboard.name}</h2>
                    <p>{dashboard.description}</p>
                    <iframe
                        title={"Agents Performance"}
                        width={"1140"}
                        height={"541.25"}
                        src={`https://app.powerbi.com/reportEmbed?reportId=${dashboard.id}&autoAuth=true&ctid=a5504f25-7802-4f62-9940-f4a2f7eba746`}
                        allowFullScreen={true}>
                    </iframe>
                    <br />
                </li>
            </ul >

            <Link to="/groups">Voltar ao Início</Link>
        </>
    )
}

export default DashboardId
