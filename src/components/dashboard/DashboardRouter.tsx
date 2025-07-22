
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
      const currentPath = window.location.pathname;
      
      // Redirect to role-specific dashboard if on general dashboard
      if (targetRoute && currentPath === '/dashboard') {
        navigate(targetRoute, { replace: true });
      }
    }
  }, [profile, navigate]);

  return <Dashboard />;
};
