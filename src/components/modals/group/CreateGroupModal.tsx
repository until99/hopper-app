import { useState } from 'react';
import axios from 'axios';
import Modal from '../Modal';
import '../../../styles/UserModal.css';

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGroupCreated: () => void;
}

export default function CreateGroupModal({
    isOpen,
    onClose,
    onGroupCreated,
}: CreateGroupModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        active: true,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (formData.name.length < 3) {
            setError('O nome deve ter pelo menos 3 caracteres');
            setLoading(false);
            return;
        }

        try {
            const params = new URLSearchParams({
                name: formData.name,
                description: formData.description,
                active: formData.active.toString(),
            });

            await axios({
                method: 'post',
                url: `${import.meta.env.VITE_API_URL}/app/groups?${params.toString()}`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });

            onGroupCreated();
            handleClose();
        } catch (err: any) {
            console.error('Error creating group:', err);
            console.error('Error response:', err.response?.data);

            let errorMessage = 'Erro ao criar grupo';

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
            } else if (err.response?.status === 422) {
                errorMessage = 'Dados inválidos. Verifique os campos e tente novamente.';
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

    const handleClose = () => {
        setFormData({
            name: '',
            description: '',
            active: true,
        });
        setError(null);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Criar Novo Grupo">
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
                        onClick={handleClose}
                        className="btn-secondary"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Criando...' : 'Criar Grupo'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
