
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { StudentDashboard } from '@/components/dashboards/StudentDashboard';
import { TrainerDashboard } from '@/components/dashboards/TrainerDashboard';
import { StaffDashboard } from '@/components/dashboards/StaffDashboard';
import { AdminDashboard } from '@/components/dashboards/AdminDashboard';
import { AuthModal } from '@/components/auth/AuthModal';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, LogIn } from 'lucide-react';
import { useState } from 'react';

export const AuthGuard = () => {
  console.log('AuthGuard: Component rendering');
  
  const { profile, loading, user, refreshProfile } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  console.log('AuthGuard: Auth state ->', { 
    hasUser: !!user, 
    hasProfile: !!profile, 
    loading, 
    userEmail: user?.email,
    profileRole: profile?.role 
  });

  const handleRefreshProfile = async () => {
    console.log('AuthGuard: Refreshing profile...');
    setIsRefreshing(true);
    await refreshProfile();
    setIsRefreshing(false);
  };

  if (loading) {
    console.log('AuthGuard: Showing loading state');
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
          <p className="text-xs text-muted-foreground">Setting up your authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('AuthGuard: No user found, showing login screen');
    return (
      <>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-6 p-6 max-w-md">
            <div className="flex justify-center mb-6">
              <img 
                src="/lovable-uploads/42d39ae8-ded6-4d36-87fd-20233841bdf4.png" 
                alt="YouthNet Logo" 
                className="h-20 w-auto object-contain"
              />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome to YouthNet</h2>
            <p className="text-muted-foreground mb-4">Management Information System</p>
            
            <Alert className="text-left">
              <LogIn className="h-4 w-4" />
              <AlertDescription>
                Please sign in to access your personalized dashboard. Use the demo accounts for instant access to explore different user roles.
              </AlertDescription>
            </Alert>
            
            <Button onClick={() => setShowAuthModal(true)} className="px-8 py-2" size="lg">
              <LogIn className="h-4 w-4 mr-2" />
              Access Dashboard
            </Button>
            
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Demo Credentials:</p>
              <p>Admin: admin@youthnet.in / admin123</p>
              <p>Staff: staff@youthnet.in / staff123</p>
              <p>Trainer: trainer@youthnet.in / trainer123</p>
              <p>Student: student@youthnet.in / student123</p>
            </div>
          </div>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    );
  }

  if (!profile) {
    console.log('AuthGuard: User exists but no profile, showing profile loading');
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md p-6">
          <div className="w-16 h-16 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin mx-auto"></div>
          <h2 className="text-xl font-semibold text-white mb-2">Setting up your profile...</h2>
          <p className="text-muted-foreground mb-4">This may take a moment for new accounts.</p>
          
          <Alert className="text-left">
            <AlertDescription>
              Your profile is being created automatically. If this takes longer than expected, try refreshing your profile.
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col gap-3">
            <Button 
              variant="outline" 
              onClick={handleRefreshProfile}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Profile'}
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => window.location.reload()}
              className="text-sm"
            >
              Refresh Page
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Profile loading issue? Contact support if this persists.
          </p>
        </div>
      </div>
    );
  }

  console.log('AuthGuard: Routing user with profile:', profile);

  // Route to appropriate dashboard based on role
  switch (profile.role) {
    case 'student':
      console.log('AuthGuard: Routing to StudentDashboard');
      return <StudentDashboard />;
    case 'trainer':
      console.log('AuthGuard: Routing to TrainerDashboard');
      return <TrainerDashboard />;
    case 'staff':
      console.log('AuthGuard: Routing to StaffDashboard');
      return <StaffDashboard />;
    case 'admin':
      console.log('AuthGuard: Routing to AdminDashboard');
      return <AdminDashboard />;
    default:
      console.log('AuthGuard: Unknown role, defaulting to StudentDashboard:', profile.role);
      return <StudentDashboard />; // Default fallback
  }
};
