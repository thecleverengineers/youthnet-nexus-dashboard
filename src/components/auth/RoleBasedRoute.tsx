
import React, { useState } from 'react';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { useAdvancedDashboard } from '@/hooks/useAdvancedDashboard';
import { StudentDashboard } from '@/components/dashboards/StudentDashboard';
import { TrainerDashboard } from '@/components/dashboards/TrainerDashboard';
import { StaffDashboard } from '@/components/dashboards/StaffDashboard';
import { AdminDashboard } from '@/components/dashboards/AdminDashboard';
import { AuthModal } from '@/components/auth/AuthModal';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ConnectionStatus } from '@/components/common/ConnectionStatus';
import { RefreshCw, LogIn, Loader2 } from 'lucide-react';

export const RoleBasedRoute = () => {
  const { profile, loading, user, refreshProfile, isOnline } = useUnifiedAuth();
  const dashboardData = useAdvancedDashboard();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshProfile = async () => {
    setIsRefreshing(true);
    await refreshProfile();
    setIsRefreshing(false);
  };

  if (loading || dashboardData.loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-16 w-16 animate-spin mx-auto text-blue-500" />
          <div className="space-y-2">
            <p className="text-lg font-medium">Loading YouthNet Platform</p>
            <p className="text-muted-foreground">Setting up your personalized experience...</p>
            {!isOnline && (
              <p className="text-sm text-yellow-600">Waiting for internet connection...</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
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
                Please sign in to access your personalized dashboard with real-time data and advanced features.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              <Button 
                onClick={() => setShowAuthModal(true)} 
                className="w-full px-8 py-3" 
                size="lg"
                disabled={!isOnline}
              >
                <LogIn className="h-5 w-5 mr-2" />
                Access Your Dashboard
              </Button>
              
              {!isOnline && (
                <div className="text-sm text-yellow-600">
                  Please check your internet connection
                </div>
              )}
            </div>
            
            <ConnectionStatus showDetails={true} />
          </div>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md p-6">
          <Loader2 className="h-16 w-16 animate-spin mx-auto text-yellow-500" />
          <h2 className="text-xl font-semibold text-white mb-2">Setting up your profile...</h2>
          <p className="text-muted-foreground mb-4">
            We're preparing your personalized dashboard with all the advanced features.
          </p>
          
          <Alert className="text-left">
            <AlertDescription>
              Your profile is being created automatically. This includes setting up your role-based access, 
              dashboard preferences, and notification settings.
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col gap-3">
            <Button 
              variant="outline" 
              onClick={handleRefreshProfile}
              disabled={isRefreshing || !isOnline}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Profile'}
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => window.location.reload()}
              className="text-sm"
              disabled={!isOnline}
            >
              Reload Application
            </Button>
          </div>
          
          <ConnectionStatus showDetails={true} />
          
          <p className="text-xs text-muted-foreground">
            Having issues? The system will automatically retry. Contact support if this persists.
          </p>
        </div>
      </div>
    );
  }

  console.log('Routing user with profile:', profile);
  console.log('Dashboard data loaded:', !!dashboardData.stats);

  // Pass dashboard data to components
  const dashboardProps = {
    dashboardData,
    userProfile: profile,
  };

  switch (profile.role || profile.profile?.role) {
    case 'student':
      return <StudentDashboard {...dashboardProps} />;
    case 'trainer':
      return <TrainerDashboard {...dashboardProps} />;
    case 'staff':
      return <StaffDashboard {...dashboardProps} />;
    case 'admin':
      return <AdminDashboard {...dashboardProps} />;
    default:
      console.log('Unknown role, defaulting to student dashboard:', profile.role);
      return <StudentDashboard {...dashboardProps} />;
  }
};
