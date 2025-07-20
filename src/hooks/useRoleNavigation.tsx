
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
      navigate(targetRoute);
    } else {
      navigate('/dashboard');
    }
  };

  return { redirectToDashboard };
};
