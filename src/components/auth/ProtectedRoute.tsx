
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from './AuthModal';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useRoleNavigation } from '@/hooks/useRoleNavigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { redirectToDashboard } = useRoleNavigation();

  useEffect(() => {
    // Auto-redirect users to their role-specific dashboard after login
    if (user && profile) {
      const currentPath = window.location.pathname;
      
      // If user is on index page, redirect to role-specific dashboard
      if (currentPath === '/') {
        redirectToDashboard();
      }
      
      // If admin user tries to access general dashboard, redirect to admin dashboard
      if (profile.role === 'admin' && currentPath === '/dashboard') {
        redirectToDashboard();
      }
    }
  }, [user, profile, redirectToDashboard]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6 p-8">
          <h1 className="text-4xl font-bold">YouthNet MIS</h1>
          <p className="text-xl text-muted-foreground">Management Information System</p>
          <Button 
            onClick={() => setShowAuthModal(true)}
            size="lg"
            className="px-8"
          >
            Sign In to Continue
          </Button>
          <AuthModal 
            isOpen={showAuthModal} 
            onClose={() => setShowAuthModal(false)} 
          />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
