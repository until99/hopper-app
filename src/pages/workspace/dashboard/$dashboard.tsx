import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { Link, useParams } from "react-router-dom"

import { type IDashboard } from "../../../interfaces/dashboard";
import axios from "axios";

function DashboardId() {
    const { isAdmin } = useAuth();
    const { groupId, dashboardId } = useParams();
    const [loading, setLoading] = useState(true);
    const [dashboard, setDashboard] = useState<IDashboard | null>(null);
    const [refreshLoading, setRefreshLoading] = useState(false);
    const [refreshError, setRefreshError] = useState("");
    const [refreshSuccess, setRefreshSuccess] = useState("");
    const [pipelineAssociated, setPipelineAssociated] = useState<string | null>(null);

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
        // Buscar pipeline associado
        axios.get(
            `${import.meta.env.VITE_API_URL}/app/dashboards/${dashboardId}/pipeline`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            }
        ).then((assocRes) => {
            console.log("API /app/dashboards/{dashboardId}/pipeline response:", assocRes.data);
            if (assocRes.data.items && assocRes.data.items.length > 0) {
                setPipelineAssociated(assocRes.data.items[0].pipeline_id);
                console.log("Pipeline associado:", assocRes.data.items[0].pipeline_id);
            } else {
                setPipelineAssociated(null);
                console.log("Nenhum pipeline associado ao dashboard.");
            }
        }).catch((err) => {
            setPipelineAssociated(null);
            console.log("Erro ao buscar pipeline associado:", err);
        });
    }, [groupId, dashboardId]);

    const handleRefreshPipeline = async () => {
        setRefreshLoading(true);
        setRefreshError("");
        setRefreshSuccess("");
        try {
            // Buscar pipeline associado ao dashboard
            const assocRes = await axios.get(
                `${import.meta.env.VITE_API_URL}/app/dashboards/${dashboardId}/pipeline`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                }
            );
            let pipelineId = null;
            if (assocRes.data.items && assocRes.data.items.length > 0) {
                pipelineId = assocRes.data.items[0].pipeline_id;
            }
            if (!pipelineId) {
                setRefreshError("Nenhum pipeline associado a este dashboard.");
                setRefreshLoading(false);
                return;
            }
            await axios.post(
                `${import.meta.env.VITE_API_URL}/app/pipeline/${pipelineId}/refresh`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                }
            );
            setRefreshSuccess("Pipeline executado com sucesso!");
        } catch (err: any) {
            setRefreshError("Erro ao executar pipeline.");
        } finally {
            setRefreshLoading(false);
        }
    };

    if (loading) {
        return <div>Thinking...</div>;
    }

    if (!dashboard) {
        return <div>Dashboard not found</div>;
    }

    return (
        <div style={{ position: "relative", minHeight: "600px" }}>
            <h1>Dashboard</h1>
            <ul>
                <li key={dashboard.id}>
                    <h2>{dashboard.name}</h2>
                    <p>{dashboard.description}</p>
                    <iframe
                        title={"Agents Performance"}
                        width={"1140"}
                        height={"541.25"}
                        src={`https://app.powerbi.com/reportEmbed?reportId=${dashboard.id}&autoAuth=true&ctid=a5504f25-7802-4f62-9940-f4a2f7eba746`}
                        allowFullScreen={true}
                    />
                    <br />
                </li>
            </ul>

            {/* Diagnóstico: logar role do usuário e pipelineAssociated */}
            {console.log("Role do usuário:", (typeof isAdmin === 'function' ? isAdmin() : isAdmin))}
            {console.log("pipelineAssociated:", pipelineAssociated)}
            {/* Botão de refresh de pipeline no canto inferior esquerdo, só se houver pipeline associado e usuário for admin */}
            {pipelineAssociated && isAdmin() && (
                <div style={{ position: "fixed", left: 24, bottom: 24, zIndex: 1000 }}>
                    <button
                        style={{ background: '#1976d2', color: '#fff', borderRadius: 4, padding: '8px 20px', fontSize: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                        onClick={handleRefreshPipeline}
                        disabled={refreshLoading}
                    >
                        {refreshLoading ? "Executando..." : "Rodar Pipeline"}
                    </button>
                    {refreshError && <div style={{ color: 'red', marginTop: 8 }}>{refreshError}</div>}
                    {refreshSuccess && <div style={{ color: 'green', marginTop: 8 }}>{refreshSuccess}</div>}
                </div>
            )}

            <Link to="/workspaces">Voltar ao Início</Link>
        </div>
    );
}

export default DashboardId
