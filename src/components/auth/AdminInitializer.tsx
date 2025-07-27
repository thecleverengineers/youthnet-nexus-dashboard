
import React, { useEffect } from 'react';
import { useAdminInitializer } from '@/hooks/useAdminInitializer';

export const AdminInitializer: React.FC = () => {
  const { initializeAdmin, isInitializing } = useAdminInitializer();

  useEffect(() => {
    initializeAdmin();
  }, [initializeAdmin]);

  // This component doesn't render anything visible
  // It just handles the admin initialization in the background
  return null;
};
