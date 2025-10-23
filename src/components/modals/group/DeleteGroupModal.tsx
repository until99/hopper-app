import { useState } from 'react';
import axios from 'axios';
import Modal from '../Modal';
import '../../../styles/UserModal.css';

interface DeleteGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    groupId: string | null;
    groupName: string;
    onGroupDeleted: () => void;
}

export default function DeleteGroupModal({
    isOpen,
    onClose,
    groupId,
    groupName,
    onGroupDeleted,
}: DeleteGroupModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        if (!groupId) return;

        setLoading(true);
        setError(null);

        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/app/groups/${groupId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });
            onGroupDeleted();
            onClose();
        } catch (err: any) {
            let errorMessage = 'Erro ao deletar grupo';

            if (err.response?.data?.detail) {
                if (typeof err.response.data.detail === 'string') {
                    errorMessage = err.response.data.detail;
                } else if (err.response.data.detail?.message) {
                    errorMessage = err.response.data.detail.message;
                }
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            }

            setError(errorMessage);
            console.error('Error deleting group:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Deletar Grupo">
            <div className="delete-modal-content">
                {error && <div className="error-message">{error}</div>}

                <p className="delete-warning">
                    Tem certeza que deseja deletar o grupo <strong>{groupName}</strong>?
                </p>
                <p className="delete-info">
                    Esta ação não pode ser desfeita e todos os dashboards associados a este
                    grupo também serão removidos.
                </p>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-secondary"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="btn-danger"
                        disabled={loading}
                    >
                        {loading ? 'Deletando...' : 'Deletar'}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
