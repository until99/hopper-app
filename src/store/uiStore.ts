import { create } from 'zustand';

interface ModalState {
    isOpen: boolean;
    modalType: string | null;
    modalData?: any;
}

interface NotificationState {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    isVisible: boolean;
}

interface UiState {
    // Modal State
    modal: ModalState;
    
    // Notification State
    notification: NotificationState;
    
    // Sidebar State
    sidebarCollapsed: boolean;
    
    // Modal Actions
    openModal: (modalType: string, data?: any) => void;
    closeModal: () => void;
    
    // Notification Actions
    showNotification: (message: string, type: NotificationState['type']) => void;
    hideNotification: () => void;
    
    // Sidebar Actions
    toggleSidebar: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
    // Initial State
    modal: {
        isOpen: false,
        modalType: null,
        modalData: undefined
    },
    
    notification: {
        message: '',
        type: 'info',
        isVisible: false
    },
    
    sidebarCollapsed: false,
    
    // Modal Actions
    openModal: (modalType: string, data?: any) => {
        set({
            modal: {
                isOpen: true,
                modalType,
                modalData: data
            }
        });
    },
    
    closeModal: () => {
        set({
            modal: {
                isOpen: false,
                modalType: null,
                modalData: undefined
            }
        });
    },
    
    // Notification Actions
    showNotification: (message: string, type: NotificationState['type']) => {
        set({
            notification: {
                message,
                type,
                isVisible: true
            }
        });
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            set((state) => ({
                notification: {
                    ...state.notification,
                    isVisible: false
                }
            }));
        }, 5000);
    },
    
    hideNotification: () => {
        set((state) => ({
            notification: {
                ...state.notification,
                isVisible: false
            }
        }));
    },
    
    // Sidebar Actions
    toggleSidebar: () => {
        set((state) => ({
            sidebarCollapsed: !state.sidebarCollapsed
        }));
    },
    
    setSidebarCollapsed: (collapsed: boolean) => {
        set({ sidebarCollapsed: collapsed });
    }
}));
