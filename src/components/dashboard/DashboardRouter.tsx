
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Dashboard } from '@/pages/Dashboard';

export const DashboardRouter = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (profile?.role) {
      const roleRoutes = {
        admin: '/dashboard/admin',
        staff: '/dashboard/staff',
        trainer: '/dashboard/trainer',
        student: '/dashboard/student'
      };

      const targetRoute = roleRoutes[profile.role as keyof typeof roleRoutes];
      if (targetRoute && window.location.pathname === '/dashboard') {
        navigate(targetRoute, { replace: true });
      }
    }
  }, [profile, navigate]);

  return <Dashboard />;
};
