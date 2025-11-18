import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import type { IUser } from '../features/users/types/user';

interface AuthState {
    // State
    user: IUser | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    
    // Actions
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    setUser: (user: IUser) => void;
    setLoading: (loading: boolean) => void;
    isAdmin: () => boolean;
    initAuth: () => Promise<void>;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            // Initial State
            user: null,
            token: null,
            isAuthenticated: false,
            loading: true,

            // Login Action
            login: async (email: string, password: string): Promise<boolean> => {
                try {
                    const response = await axios.post(`${API_URL}/user/auth`, {
                        email,
                        password,
                    });

                    if (response.data && response.data.token) {
                        const { token, record } = response.data;

                        set({
                            user: record,
                            token,
                            isAuthenticated: true,
                            loading: false
                        });

                        return true;
                    }
                    return false;
                } catch (error) {
                    console.error('Erro ao fazer login:', error);
                    set({ loading: false });
                    return false;
                }
            },

            // Logout Action
            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false
                });
                
                // Clear data cache on logout
                if (typeof window !== 'undefined') {
                    try {
                        localStorage.removeItem('hopper-data-storage');
                    } catch (error) {
                        console.error('Error clearing data cache:', error);
                    }
                }
            },

            // Set User
            setUser: (user: IUser) => {
                set({ user });
            },

            // Set Loading
            setLoading: (loading: boolean) => {
                set({ loading });
            },

            // Check if user is admin
            isAdmin: () => {
                const { user } = get();
                return user?.role === 'admin';
            },

            // Initialize auth from localStorage
            initAuth: async () => {
                const { token, user } = get();
                
                if (token && user) {
                    set({
                        isAuthenticated: true,
                        loading: false
                    });
                } else {
                    set({ loading: false });
                }
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
);
