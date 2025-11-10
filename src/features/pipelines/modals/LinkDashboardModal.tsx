
import React, { useState } from "react";
import type { IDashboard } from "../../dashboard/types/dashboard";
import axios from "axios";
import Modal from "../../../shared/components/Modal";
import "../../../shared/styles/forms.css";

interface LinkDashboardModalProps {
    isOpen: boolean;
    onClose: () => void;
    pipelineId: string | null;
    dashboards: IDashboard[];
    onDashboardLinked: () => void;
}





const LinkDashboardModal: React.FC<LinkDashboardModalProps> = ({ isOpen, onClose, pipelineId, dashboards, onDashboardLinked }) => {
    const [selectedDashboardId, setSelectedDashboardId] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [dashboardsLoading, setDashboardsLoading] = useState(true);
    const [availableDashboards, setAvailableDashboards] = useState<IDashboard[]>([]);

    React.useEffect(() => {
        let mounted = true;
        async function selectLinkedDashboard() {
            setDashboardsLoading(true);
            let alreadyLinkedDashboardId: string | null = null;
            if (pipelineId) {
                try {
                    const assocRes = await axios.get(
                        `${import.meta.env.VITE_API_URL}/app/dashboards/${pipelineId}/pipeline`,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('authToken')}`
                            }
                        }
                    );
                    if (assocRes.data.items && assocRes.data.items.length > 0) {
                        alreadyLinkedDashboardId = assocRes.data.items[0].dashboard_id;
                    }
                } catch {
                    // ignora erro
                }
            }
            if (mounted) {
                setAvailableDashboards(dashboards);
                setDashboardsLoading(false);
                if (alreadyLinkedDashboardId) {
                    setSelectedDashboardId(alreadyLinkedDashboardId);
                } else {
                    setSelectedDashboardId("");
                }
            }
        }
        if (isOpen && dashboards.length > 0 && pipelineId) {
            selectLinkedDashboard();
        } else {
            setAvailableDashboards([]);
            setDashboardsLoading(true);
            setSelectedDashboardId("");
        }
        return () => { mounted = false; };
    }, [isOpen, dashboards, pipelineId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pipelineId || !selectedDashboardId) return;
        setLoading(true);
        setError("");
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/app/pipelines/${pipelineId}/dashboard/${selectedDashboardId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                }
            );
            setLoading(false);
            onDashboardLinked();
            onClose();
        } catch (err: any) {
            setLoading(false);
            setError("Erro ao vincular dashboard.");
        }
    };

    const handleClose = () => {
        setSelectedDashboardId("");
        setError("");
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={"Vincular Dashboard ao Pipeline"}
        >
            <form onSubmit={handleSubmit} className="user-form">
                {error && <div className="error-message">{error}</div>}
                <div className="form-group">
                    <label htmlFor="dashboard-select">Dashboard:</label>
                    {dashboardsLoading ? (
                        <div style={{ color: '#666', margin: '8px 0' }}>Carregando dashboards...</div>
                    ) : availableDashboards.length === 0 ? (
                        <div style={{ color: '#666', margin: '8px 0' }}>Nenhum dashboard disponível para associação.</div>
                    ) : (
                        <select
                            id="dashboard-select"
                            value={selectedDashboardId}
                            onChange={e => setSelectedDashboardId(e.target.value)}
                            disabled={loading}
                        >
                            <option value="">Selecione um dashboard</option>
                            {availableDashboards.map(d => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                    )}
                </div>
                <div className="form-actions">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="btn-secondary"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading || !selectedDashboardId || dashboardsLoading}
                    >
                        {loading ? "Vinculando..." : "Vincular"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default LinkDashboardModal;
