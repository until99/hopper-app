import { useEffect, useRef } from 'react';
import { useInitializeData } from '../../../hooks/useDataFetch';
import { useAuthStore } from '../../../store/authStore';

/**
 * Component that initializes all application data after login
 * This component should be placed inside the authenticated routes
 */
export const DataInitializer = () => {
    const { user } = useAuthStore();
    const { initializeAllData } = useInitializeData();
    const hasInitialized = useRef(false);

    useEffect(() => {
        // Only initialize once when user is logged in
        if (user && !hasInitialized.current) {
            hasInitialized.current = true;
            console.log('User logged in, initializing data...');
            initializeAllData();
        }

        // Reset on logout
        if (!user) {
            hasInitialized.current = false;
        }
    }, [user, initializeAllData]);

    // This component doesn't render anything
    return null;
};
