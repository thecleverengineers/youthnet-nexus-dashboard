
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
  const { profile, user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  console.log('RoleBasedRoute - User:', !!user, 'Profile:', profile);

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
            <h2 className="text-3xl font-bold text-foreground mb-2">Welcome to YouthNet</h2>
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

  // Determine the role - use profile role if available, otherwise default to 'student'
  const userRole = profile?.role || 'student';
  
  console.log('Routing user with role:', userRole);

  // Route based on role - display dashboard directly
  switch (userRole) {
    case 'student':
      return <StudentDashboard />;
    case 'trainer':
      return <TrainerDashboard />;
    case 'staff':
      return <StaffDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      console.log('Unknown role, defaulting to student dashboard:', userRole);
      return <StudentDashboard />;
  }
};
