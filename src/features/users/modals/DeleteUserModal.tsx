import { useState } from 'react';
import axios from 'axios';
import Modal from '../../../shared/components/Modal';
import '../../../shared/styles/forms.css';

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  username: string;
  onUserDeleted: () => void;
}

export default function DeleteUserModal({
  isOpen,
  onClose,
  userId,
  username,
  onUserDeleted,
}: DeleteUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      onUserDeleted();
      onClose();
    } catch (err) {
      setError('Erro ao deletar usuário');
      console.error('Error deleting user:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Deletar Usuário">
      <div className="delete-modal-content">
        {error && <div className="error-message">{error}</div>}

        <p className="delete-warning">
          Tem certeza que deseja deletar o usuário <strong>{username}</strong>?
        </p>
        <p className="delete-info">Esta ação não pode ser desfeita.</p>

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
