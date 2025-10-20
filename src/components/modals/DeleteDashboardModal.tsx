import { useState } from 'react';
import axios from 'axios';
import Modal from './Modal';
import '../../styles/UserModal.css';

interface DeleteDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  dashboardId: string | null;
  groupId: string | null;
  dashboardName: string;
  datasetId: string | null;
  onDashboardDeleted: () => void;
}

export default function DeleteDashboardModal({
  isOpen,
  onClose,
  dashboardId,
  groupId,
  datasetId,
  dashboardName,
  onDashboardDeleted,
}: DeleteDashboardModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!dashboardId) return;

    setLoading(true);
    setError(null);

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/groups/${groupId}/report/${dashboardId}/dataset/${datasetId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      onDashboardDeleted();
      onClose();
    } catch (err) {
      setError('Error deleting dashboard');
      console.error('Error deleting dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Dashboard">
      <div className="delete-modal-content">
        {error && <div className="error-message">{error}</div>}

        <p className="delete-warning">
          Are you sure you want to delete the dashboard <strong>{dashboardName}</strong>?
        </p>
        <p className="delete-info">This action cannot be undone.</p>

        <div className="form-actions">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="btn-danger"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
