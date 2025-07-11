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
  createDemoAccounts: () => Promise<boolean>;
}

const MongoAuthContext = createContext<AuthContextType | undefined>(undefined);

export function MongoAuthProvider({ children }: { children: ReactNode }) {
  console.log('MongoAuthProvider: Initializing...');
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    try {
      console.log('MongoAuthProvider: Fetching profile...');
      const response = await authApi.getProfile();
      
      if (response.success && response.data?.user) {
        console.log('MongoAuthProvider: Profile loaded:', response.data.user);
        // Add id field for compatibility with Supabase auth
        const userWithId = { ...response.data.user, id: response.data.user._id };
        setUser(userWithId);
      } else {
        console.log('MongoAuthProvider: No profile data received');
        setUser(null);
      }
    } catch (error) {
      console.error('MongoAuthProvider: Error fetching profile:', error);
      const errorMessage = handleApiError(error);
      
      // Don't show error toast for 401 errors (user not logged in)
      if (!error.response || error.response.status !== 401) {
        toast.error(`Profile error: ${errorMessage}`);
      }
      setUser(null);
    }
  };

  useEffect(() => {
    console.log('MongoAuthProvider: Setting up auth check...');
    
    const initializeAuth = async () => {
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
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('MongoAuthProvider: Attempting to sign in:', email);
      setLoading(true);
      
      const response = await authApi.login({ email, password });
      
      if (response.success && response.data) {
        const { user, token, refreshToken } = response.data;
        
        console.log('MongoAuthProvider: Sign in successful:', user.email);
        
        // Store tokens
        setAuthToken(token);
        localStorage.setItem('refresh_token', refreshToken);
        
        // Set user with compatibility id
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
        
        // Store tokens
        setAuthToken(token);
        localStorage.setItem('refresh_token', refreshToken);
        
        // Set user with compatibility id
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
      
      // Call logout endpoint
      await authApi.logout();
      
      // Clear tokens and user
      setAuthToken(null);
      localStorage.removeItem('refresh_token');
      setUser(null);
      
      console.log('MongoAuthProvider: Sign out successful');
      toast.success('Signed out successfully!');
    } catch (error) {
      console.error('MongoAuthProvider: Sign out error:', error);
      
      // Clear local state even if API call fails
      setAuthToken(null);
      localStorage.removeItem('refresh_token');
      setUser(null);
      
      toast.success('Signed out successfully!');
    }
  };

  const updateProfile = async (profileData: { fullName?: string; phone?: string }): Promise<boolean> => {
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

  const createDemoAccounts = async (): Promise<boolean> => {
    const demoUsers = [
      { email: 'admin@youthnet.in', password: 'admin123', role: 'admin', fullName: 'Admin User' },
      { email: 'staff@youthnet.in', password: 'staff123', role: 'staff', fullName: 'Staff User' },
      { email: 'trainer@youthnet.in', password: 'trainer123', role: 'trainer', fullName: 'Trainer User' },
      { email: 'student@youthnet.in', password: 'student123', role: 'student', fullName: 'Student User' },
    ];

    try {
      console.log('MongoAuthProvider: Creating demo accounts...');
      let successCount = 0;
      
      for (const user of demoUsers) {
        try {
          await authApi.register({
            email: user.email,
            password: user.password,
            fullName: user.fullName,
            role: user.role
          });
          successCount++;
        } catch (error) {
          // User might already exist - that's okay
          if (error.response?.status === 409) {
            console.log('MongoAuthProvider: Demo account already exists:', user.email);
            successCount++;
          } else {
            console.error('MongoAuthProvider: Error creating demo account:', user.email, error);
          }
        }
      }
      
      if (successCount === demoUsers.length) {
        toast.success('All demo accounts are ready!');
        return true;
      } else if (successCount > 0) {
        toast.success(`${successCount} demo accounts are ready!`);
        return true;
      } else {
        toast.error('Failed to create demo accounts');
        return false;
      }
    } catch (error) {
      console.error('MongoAuthProvider: Error in createDemoAccounts:', error);
      toast.error('Failed to create demo accounts');
      return false;
    }
  };

  const value = {
    user,
    session: null, // For compatibility with Supabase auth
    loading,
    signIn,
    signUp,
    signOut,
    profile: user, // For compatibility with existing code
    refreshProfile,
    updateProfile,
    createDemoAccounts,
  };

  console.log('MongoAuthProvider: Providing context with state:', { 
    hasUser: !!user, 
    loading,
    userRole: user?.profile?.role
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