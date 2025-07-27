
import { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { toast } from 'sonner';

export const useAdminInitializer = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeAdmin = async () => {
    if (isInitialized || isInitializing) return;
    
    setIsInitializing(true);
    try {
      const result = await adminService.initializeDefaultAdmin();
      
      if (result.success) {
        console.log('Admin initialization:', result.message);
        setIsInitialized(true);
      } else {
        console.error('Admin initialization failed:', result.error);
      }
    } catch (error) {
      console.error('Failed to initialize admin user:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    // Initialize admin user when the hook is first used
    initializeAdmin();
  }, []);

  return {
    initializeAdmin,
    isInitializing,
    isInitialized
  };
};
