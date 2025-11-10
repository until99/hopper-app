import { useState, useEffect } from 'react';
import { groupsService } from '../services/groupsApiService';
import Modal from '../../../shared/components/Modal';
import '../../../shared/styles/forms.css';

interface EditGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    groupId: string | null;
    onGroupUpdated: () => void;
}

export default function EditGroupModal({
    isOpen,
    onClose,
    groupId,
    onGroupUpdated,
}: EditGroupModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        active: true,
    });

    useEffect(() => {
        if (isOpen && groupId) {
            fetchGroupData();
        }
    }, [isOpen, groupId]);

    const fetchGroupData = async () => {
        if (!groupId) return;
        
        setLoading(true);
        setError(null);
        try {
            const group = await groupsService.fetchGroupInfo(groupId);
            setFormData({
                name: group.name,
                description: group.description,
                active: group.active,
            });
        } catch (err) {
            setError('Erro ao carregar dados do grupo');
            console.error('Error fetching group:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!groupId) return;
        
        setLoading(true);
        setError(null);

        if (formData.name.length < 3) {
            setError('O nome deve ter pelo menos 3 caracteres');
            setLoading(false);
            return;
        }

        try {
            await groupsService.updateGroup(groupId, formData);
            onGroupUpdated();
            onClose();
        } catch (err: any) {
            let errorMessage = 'Erro ao atualizar grupo';

            if (err.response?.data?.detail) {
                if (Array.isArray(err.response.data.detail)) {
                    const firstError = err.response.data.detail[0];
                    if (typeof firstError === 'string') {
                        errorMessage = firstError;
                    } else if (firstError?.msg) {
                        errorMessage = firstError.msg;
                    } else if (firstError?.message) {
                        errorMessage = firstError.message;
                    }
                } else if (typeof err.response.data.detail === 'string') {
                    errorMessage = err.response.data.detail;
                }
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editar Grupo">
            <form onSubmit={handleSubmit} className="user-form">
                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                    <label htmlFor="name">Nome:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        minLength={3}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Descrição:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        disabled={loading}
                        rows={4}
                        style={{ resize: 'vertical' }}
                    />
                </div>

                <div className="form-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="active"
                            checked={formData.active}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        Ativo
                    </label>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-secondary"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Atualizando...' : 'Atualizar Grupo'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
