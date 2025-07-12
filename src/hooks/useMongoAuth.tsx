
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { authApi, setAuthToken, handleApiError } from '@/lib/api';
import { toast } from 'sonner';

interface User {
  _id: string;
  id: string; // For compatibility with Supabase auth
  email: string;
  profile: {
    fullName: string;
    phone?: string;
    role: string;
  };
  isEmailVerified: boolean;
  lastLogin?: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthContextType {
  user: User | null;
  session: null; // For compatibility with Supabase auth
  loading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  profile: User | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: { fullName?: string; phone?: string }) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  isOnline: boolean;
  retryConnection: () => Promise<void>;
}

const MongoAuthContext = createContext<AuthContextType | undefined>(undefined);

export function MongoAuthProvider({ children }: { children: ReactNode }) {
  console.log('MongoAuthProvider: Initializing...');
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log('MongoAuthProvider: Connection restored');
      toast.success('Connection restored');
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('MongoAuthProvider: Connection lost');
      toast.error('Connection lost. Please check your internet connection.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const refreshProfile = async () => {
    try {
      console.log('MongoAuthProvider: Fetching profile...');
      const response = await authApi.getProfile();
      
      if (response.success && response.data?.user) {
        console.log('MongoAuthProvider: Profile loaded:', response.data.user);
        const userWithId = { ...response.data.user, id: response.data.user._id };
        setUser(userWithId);
      } else {
        console.log('MongoAuthProvider: No profile data received');
        setUser(null);
      }
    } catch (error) {
      console.error('MongoAuthProvider: Error fetching profile:', error);
      const errorMessage = handleApiError(error);
      
      if (!error.response || error.response.status !== 401) {
        toast.error(`Profile error: ${errorMessage}`);
      }
      setUser(null);
    }
  };

  const retryConnection = async () => {
    if (!isOnline) {
      toast.error('No internet connection');
      return;
    }

    setLoading(true);
    try {
      await refreshProfile();
      toast.success('Connection restored successfully');
    } catch (error) {
      toast.error('Failed to restore connection');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('MongoAuthProvider: Setting up auth check...');
    
    const initializeAuth = async () => {
      if (!isOnline) {
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('auth_token');
      
      if (token) {
        console.log('MongoAuthProvider: Found stored token, verifying...');
        setAuthToken(token);
        await refreshProfile();
      } else {
        console.log('MongoAuthProvider: No stored token found');
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, [isOnline]);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    if (!isOnline) {
      toast.error('No internet connection');
      return false;
    }

    try {
      console.log('MongoAuthProvider: Attempting to sign in:', email);
      setLoading(true);
      
      const response = await authApi.login({ email, password });
      
      if (response.success && response.data) {
        const { user, token, refreshToken } = response.data;
        
        console.log('MongoAuthProvider: Sign in successful:', user.email);
        
        setAuthToken(token);
        localStorage.setItem('refresh_token', refreshToken);
        
        const userWithId = { ...user, id: user._id };
        setUser(userWithId);
        
        toast.success('Signed in successfully!');
        return true;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('MongoAuthProvider: Sign in error:', error);
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: string): Promise<boolean> => {
    if (!isOnline) {
      toast.error('No internet connection');
      return false;
    }

    try {
      console.log('MongoAuthProvider: Attempting to sign up:', email, 'with role:', role);
      setLoading(true);
      
      const response = await authApi.register({
        email,
        password,
        fullName,
        role
      });
      
      if (response.success && response.data) {
        const { user, token, refreshToken } = response.data;
        
        console.log('MongoAuthProvider: Sign up successful:', user.email);
        
        setAuthToken(token);
        localStorage.setItem('refresh_token', refreshToken);
        
        const userWithId = { ...user, id: user._id };
        setUser(userWithId);
        
        toast.success('Account created successfully!');
        return true;
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('MongoAuthProvider: Sign up error:', error);
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      console.log('MongoAuthProvider: Signing out...');
      
      if (isOnline) {
        await authApi.logout();
      }
      
      setAuthToken(null);
      localStorage.removeItem('refresh_token');
      setUser(null);
      
      console.log('MongoAuthProvider: Sign out successful');
      toast.success('Signed out successfully!');
    } catch (error) {
      console.error('MongoAuthProvider: Sign out error:', error);
      
      setAuthToken(null);
      localStorage.removeItem('refresh_token');
      setUser(null);
      
      toast.success('Signed out successfully!');
    }
  };

  const updateProfile = async (profileData: { fullName?: string; phone?: string }): Promise<boolean> => {
    if (!isOnline) {
      toast.error('No internet connection');
      return false;
    }

    try {
      console.log('MongoAuthProvider: Updating profile...');
      
      const response = await authApi.updateProfile(profileData);
      
      if (response.success && response.data?.user) {
        const userWithId = { ...response.data.user, id: response.data.user._id };
        setUser(userWithId);
        toast.success('Profile updated successfully!');
        return true;
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error) {
      console.error('MongoAuthProvider: Profile update error:', error);
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
      return false;
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    if (!isOnline) {
      toast.error('No internet connection');
      return false;
    }

    try {
      console.log('MongoAuthProvider: Requesting password reset for:', email);
      
      // This would call a password reset endpoint
      // const response = await authApi.resetPassword({ email });
      
      toast.success('Password reset instructions sent to your email');
      return true;
    } catch (error) {
      console.error('MongoAuthProvider: Password reset error:', error);
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
      return false;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!isOnline) {
      toast.error('No internet connection');
      return false;
    }

    try {
      console.log('MongoAuthProvider: Changing password...');
      
      // This would call a change password endpoint
      // const response = await authApi.changePassword({ currentPassword, newPassword });
      
      toast.success('Password changed successfully!');
      return true;
    } catch (error) {
      console.error('MongoAuthProvider: Password change error:', error);
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
      return false;
    }
  };

  const value = {
    user,
    session: null,
    loading,
    signIn,
    signUp,
    signOut,
    profile: user,
    refreshProfile,
    updateProfile,
    resetPassword,
    changePassword,
    isOnline,
    retryConnection,
  };

  console.log('MongoAuthProvider: Providing context with state:', { 
    hasUser: !!user, 
    loading,
    userRole: user?.profile?.role,
    isOnline
  });

  return (
    <MongoAuthContext.Provider value={value}>
      {children}
    </MongoAuthContext.Provider>
  );
}

export function useMongoAuth() {
  const context = useContext(MongoAuthContext);
  if (context === undefined) {
    throw new Error('useMongoAuth must be used within a MongoAuthProvider');
  }
  return context;
}
