import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Modal from '../Modal';
import '../../../styles/UserModal.css';

interface IUser {
    id: string;
    username: string;
    email: string;
    role: "admin" | "user";
    active: boolean;
}

interface IGroupUser {
    id: string;
    user_id: string;
    username: string;
    email: string;
    role: "admin" | "user";
    active: boolean;
    created: string;
    updated: string;
}

interface AddUsersToGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    groupId: string | null;
    groupName: string;
    onUsersAdded: () => void;
}

export default function AddUsersToGroupModal({
    isOpen,
    onClose,
    groupId,
    groupName,
    onUsersAdded,
}: AddUsersToGroupModalProps) {
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [allUsers, setAllUsers] = useState<IUser[]>([]);
    const [groupUsers, setGroupUsers] = useState<IGroupUser[]>([]);

    useEffect(() => {
        if (isOpen && groupId) {
            fetchData();
        } else if (!isOpen) {
            setSearchTerm('');
            setError(null);
        }
    }, [isOpen, groupId]);

    const fetchData = async () => {
        setLoadingData(true);
        setError(null);
        try {
            const [usersResponse, groupUsersResponse] = await Promise.all([
                axios.get(
                    `${import.meta.env.VITE_API_URL}/users`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                        },
                    }
                ),
                axios.get(
                    `${import.meta.env.VITE_API_URL}/app/groups/${groupId}/users`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                        },
                    }
                )
            ]);

            // Armazena todos os usuários da API
            setAllUsers(usersResponse.data.users || []);

            // Armazena os usuários que já estão no grupo
            setGroupUsers(groupUsersResponse.data || []);

        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Erro ao carregar dados');
        } finally {
            setLoadingData(false);
        }
    };

    // Filtra usuários disponíveis removendo os que já estão no grupo
    const availableUsers = useMemo(() => {
        // Cria um Set com os user_id dos usuários que já estão no grupo
        const groupUserIds = new Set(groupUsers.map(gu => gu.user_id));

        // Filtra os usuários removendo aqueles que já estão no grupo
        const filtered = allUsers.filter(user => !groupUserIds.has(user.id));

        // Aplica o filtro de busca se houver termo de pesquisa
        if (searchTerm.trim() === '') {
            return filtered;
        }

        const lowerSearchTerm = searchTerm.toLowerCase();
        return filtered.filter(user =>
            user.username.toLowerCase().includes(lowerSearchTerm) ||
            user.email.toLowerCase().includes(lowerSearchTerm)
        );
    }, [allUsers, groupUsers, searchTerm]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!groupId) return;
        setLoading(true);
        setError(null);
        try {
            const usersArray = Array.from(selectedUsers);
            for (const userId of usersArray) {
                await axios.post(
                    `${import.meta.env.VITE_API_URL}/app/groups/${groupId}/users/${userId}`,
                    { userId },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                        },
                    }
                );
            }
            onUsersAdded();
            onClose();
        } catch (err) {
            console.error('Error adding users to group:', err);
            setError('Erro ao adicionar usuários ao grupo');
        } finally {
            setLoading(false);
        }
    };

    const handleUserToggle = (userId: string) => {
        setSelectedUsers((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(userId)) {
                newSet.delete(userId);
            } else {
                newSet.add(userId);
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
            title={`Add user to group: ${groupName}`}
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
                    <label>Users:</label>
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
                                Retrieving users...
                            </p>
                        ) : availableUsers.length === 0 ? (
                            <p style={{ color: '#666', textAlign: 'center' }}>
                                No users available
                            </p>
                        ) : (
                            availableUsers.map((user) => {
                                return (
                                    <label
                                        key={user.id}
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
                                            onChange={() => handleUserToggle(user.id)}
                                            disabled={loading}
                                        />
                                        <span style={{ marginLeft: '8px' }}>
                                            <strong>{user.username}</strong> ({user.email})
                                            {!user.active && (
                                                <span style={{ color: '#999' }}> - Inativo</span>
                                            )}
                                        </span>
                                    </label>
                                );
                            })
                        )}
                    </div>

                    {selectedUsers.size > 0 && (
                        <p style={{ marginTop: '8px', color: '#666' }}>
                            {selectedUsers.size} user(s) selected
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
