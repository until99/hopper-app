import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';
import '../../styles/UserModal.css';

interface IDashboard {
  id: string;
  name: string;
  datasetId: string;
  description: string;
  groupId: string;
}

interface EditDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  dashboardId: string | null;
  onDashboardUpdated: () => void;
}

export default function EditDashboardModal({
  isOpen,
  onClose,
  dashboardId,
  onDashboardUpdated,
}: EditDashboardModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    datasetId: '',
    description: '',
    groupId: '',
  });

  useEffect(() => {
    if (isOpen && dashboardId) {
      fetchDashboardData();
    }
  }, [isOpen, dashboardId]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<IDashboard>(
        `${import.meta.env.VITE_API_URL}/dashboards/${dashboardId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      const dashboard = response.data;
      setFormData({
        name: dashboard.name,
        datasetId: dashboard.datasetId,
        description: dashboard.description,
        groupId: dashboard.groupId,
      });
    } catch (err) {
      setError('Error loading dashboard data');
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios({
        url: `${import.meta.env.VITE_API_URL}/dashboards/${dashboardId}`,
        method: 'patch',
        data: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      onDashboardUpdated();
      onClose();
    } catch (err) {
      setError('Error updating dashboard');
      console.error('Error updating dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Dashboard">
      <form onSubmit={handleSubmit} className="user-form">
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="datasetId">Dataset ID:</label>
          <input
            type="text"
            id="datasetId"
            name="datasetId"
            value={formData.datasetId}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={loading}
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="groupId">Group ID:</label>
          <input
            type="text"
            id="groupId"
            name="groupId"
            value={formData.groupId}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
