import { useState, useEffect, useMemo } from 'react';
import { groupsService } from '../services/groupsApiService';
import { dashboardService } from '../../dashboard/services/dashboardService';
import Modal from '../../../shared/components/Modal';
import '../../../shared/styles/forms.css';

interface IDashboard {
    id: string;
    datasetId: string;
    description: string | null;
    groupId: string;
    groupName: string;
    name: string;
}

interface AddDashboardsToGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    groupId: string | null;
    groupName: string;
    onDashboardsAdded: () => void;
}

export default function AddDashboardsToGroupModal({
    isOpen,
    onClose,
    groupId,
    groupName,
    onDashboardsAdded,
}: AddDashboardsToGroupModalProps) {
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedDashboards, setSelectedDashboards] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [allDashboards, setAllDashboards] = useState<IDashboard[]>([]);
    const [groupDashboards, setGroupDashboards] = useState<IDashboard[]>([]);

    useEffect(() => {
        if (isOpen && groupId) {
            fetchData();
        } else if (!isOpen) {
            setSearchTerm('');
            setSelectedDashboards(new Set());
            setError(null);
        }
    }, [isOpen, groupId]);

    const fetchData = async () => {
        if (!groupId) return;
        
        setLoadingData(true);
        setError(null);
        try {
            const [dashboardsData, groupDashboardsData] = await Promise.all([
                dashboardService.fetchDashboards(),
                groupsService.fetchGroupDashboards(groupId)
            ]);

            setAllDashboards(dashboardsData.dashboards || []);
            setGroupDashboards(groupDashboardsData || []);

        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Erro ao carregar dados');
        } finally {
            setLoadingData(false);
        }
    };

    const availableDashboards = useMemo(() => {
        const groupDashboardIds = new Set(groupDashboards.map(gd => gd.id));
        const filtered = allDashboards.filter(dashboard => !groupDashboardIds.has(dashboard.id));

        if (searchTerm.trim() === '') {
            return filtered;
        }

        const lowerSearchTerm = searchTerm.toLowerCase();
        return filtered.filter(dashboard =>
            dashboard.name.toLowerCase().includes(lowerSearchTerm) ||
            (dashboard.description && dashboard.description.toLowerCase().includes(lowerSearchTerm))
        );
    }, [allDashboards, groupDashboards, searchTerm]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!groupId) return;
        setLoading(true);
        setError(null);
        try {
            const dashboardsArray = Array.from(selectedDashboards);
            for (const dashboardId of dashboardsArray) {
                await groupsService.addDashboardToGroup(groupId, dashboardId);
            }
            onDashboardsAdded();
            onClose();
        } catch (err) {
            console.error('Error adding dashboards to group:', err);
            setError('Erro ao adicionar dashboards ao grupo');
        } finally {
            setLoading(false);
        }
    };

    const handleDashboardToggle = (dashboardId: string) => {
        setSelectedDashboards((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(dashboardId)) {
                newSet.delete(dashboardId);
            } else {
                newSet.add(dashboardId);
            }
            return newSet;
        });
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={`Add dashboards to group: ${groupName}`}
        >
            <form onSubmit={handleSubmit} className="user-form">
                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                    <label htmlFor="search">Search:</label>
                    <input
                        type="text"
                        id="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="|"
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label>Dashboards:</label>
                    <div
                        style={{
                            maxHeight: '300px',
                            overflowY: 'auto',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            padding: '10px',
                        }}
                    >
                        {loadingData ? (
                            <p style={{ color: '#666', textAlign: 'center' }}>
                                Retrieving dashboards...
                            </p>
                        ) : availableDashboards.length === 0 ? (
                            <p style={{ color: '#666', textAlign: 'center' }}>
                                No dashboards available
                            </p>
                        ) : (
                            availableDashboards.map((dashboard) => {
                                return (
                                    <label
                                        key={dashboard.id}
                                        className="checkbox-label"
                                        style={{
                                            display: 'block',
                                            padding: '8px',
                                            borderBottom: '1px solid #eee',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedDashboards.has(dashboard.id)}
                                            onChange={() => handleDashboardToggle(dashboard.id)}
                                            disabled={loading}
                                        />
                                        <span style={{ marginLeft: '8px' }}>
                                            <strong>{dashboard.name}</strong>
                                            {dashboard.groupName && (
                                                <span style={{ color: '#666' }}> - {dashboard.groupName}</span>
                                            )}
                                            <br />
                                        </span>
                                    </label>
                                );
                            })
                        )}
                    </div>

                    {selectedDashboards.size > 0 && (
                        <p style={{ marginTop: '8px', color: '#666' }}>
                            {selectedDashboards.size} dashboard(s) selected
                        </p>
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
                        disabled={loading}
                    >
                        {loading ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
