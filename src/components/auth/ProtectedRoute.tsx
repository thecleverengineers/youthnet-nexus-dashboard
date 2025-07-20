
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from './AuthModal';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useRoleNavigation } from '@/hooks/useRoleNavigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, profile } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { redirectToDashboard } = useRoleNavigation();

  useEffect(() => {
    // Redirect to role-specific dashboard if user just logged in and is on index page
    if (user && profile && window.location.pathname === '/') {
      redirectToDashboard();
    }
  }, [user, profile, redirectToDashboard]);

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
