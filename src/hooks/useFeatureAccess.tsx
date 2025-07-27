import { useState, useEffect } from 'react';
import { rbacService } from '@/services/rbacService';
import { useAuth } from '@/hooks/useAuth';

export const useFeatureAccess = (featureKey: string) => {
  const { user } = useAuth();
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user?.id || !featureKey) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      try {
        const access = await rbacService.checkUserFeatureAccess(user.id, featureKey);
        setHasAccess(access);
      } catch (error) {
        console.error('Error checking feature access:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [user?.id, featureKey]);

  return { hasAccess, loading };
};