
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { StudentDashboard } from '@/components/dashboards/StudentDashboard';
import { TrainerDashboard } from '@/components/dashboards/TrainerDashboard';
import { StaffDashboard } from '@/components/dashboards/StaffDashboard';
import { AdminDashboard } from '@/components/dashboards/AdminDashboard';
import { AuthModal } from '@/components/auth/AuthModal';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const RoleBasedRoute = () => {
  const { profile, loading, user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  console.log('RoleBasedRoute - Loading:', loading, 'User:', !!user, 'Profile:', profile);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
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
            
            <Alert>
              <AlertDescription>
                Please sign in to access your personalized dashboard. Use the demo accounts for testing.
              </AlertDescription>
            </Alert>
            
            <Button onClick={() => setShowAuthModal(true)} className="px-8 py-2">
              Sign In / Sign Up
            </Button>
          </div>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    );
  }

  // If we have a user but no profile, show error and retry option
  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 p-6 max-w-md">
          <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto"></div>
          <h2 className="text-xl font-semibold text-white mb-2">Profile Setup Issue</h2>
          <p className="text-muted-foreground mb-4">
            We're having trouble setting up your profile. This usually resolves automatically.
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
            className="px-6 py-2"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  console.log('Routing user with profile role:', profile.role);

  // Route based on role
  switch (profile.role) {
    case 'student':
      return <StudentDashboard />;
    case 'trainer':
      return <TrainerDashboard />;
    case 'staff':
      return <StaffDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      console.log('Unknown role, defaulting to student dashboard:', profile.role);
      return <StudentDashboard />;
  }
};
