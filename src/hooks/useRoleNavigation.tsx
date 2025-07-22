
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useRoleNavigation = () => {
  const { profile, user } = useAuth();
  const navigate = useNavigate();

  const redirectToDashboard = () => {
    if (!profile?.role) return;

    const roleRoutes = {
      admin: '/dashboard/admin',
      staff: '/dashboard/staff', 
      trainer: '/dashboard/trainer',
      student: '/dashboard/student'
    };

    const targetRoute = roleRoutes[profile.role as keyof typeof roleRoutes];
    if (targetRoute) {
      navigate(targetRoute, { replace: true });
    } else {
      navigate('/dashboard');
    }
  };

  // Auto-redirect admin users to admin dashboard on login
  useEffect(() => {
    if (user && profile?.role === 'admin' && window.location.pathname === '/') {
      navigate('/dashboard/admin', { replace: true });
    }
  }, [user, profile, navigate]);

  return { redirectToDashboard };
};
