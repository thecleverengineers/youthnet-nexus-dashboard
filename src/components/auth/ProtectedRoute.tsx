
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from './AuthModal';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

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
