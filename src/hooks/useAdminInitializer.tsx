
import { useState } from 'react';
import { adminService } from '@/services/adminService';
import { toast } from 'sonner';

export const useAdminInitializer = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const createAdminUser = async (userData: { email: string; password: string; fullName: string }) => {
    if (isInitializing) return;
    
    setIsInitializing(true);
    try {
      const result = await adminService.createAdminUser(userData);
      
      if (result.error) {
        toast.error(`Admin creation failed: ${result.error.message}`);
        return { success: false, error: result.error };
      } else {
        toast.success('Admin user created successfully');
        setIsInitialized(true);
        return { success: true, user: result.user };
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to create admin user';
      toast.error(errorMessage);
      console.error('Failed to create admin user:', error);
      return { success: false, error: errorMessage };
    } finally {
      setIsInitializing(false);
    }
  };

  return {
    createAdminUser,
    isInitializing,
    isInitialized
  };
};
