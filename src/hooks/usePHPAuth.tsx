
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { toast } from 'sonner';
import { authConfig } from '@/config/auth';

// 10-digit numerical API secret
const API_SECRET = '1234567890'; // Change this to match your backend secret

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

const PHPAuthContext = createContext<AuthContextType | undefined>(undefined);

export function PHPAuthProvider({ children }: { children: ReactNode }) {
  console.log('PHPAuthProvider: Initializing...');
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const apiUrl = authConfig.php.apiUrl;

  const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('auth_token');
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Secret': API_SECRET, // Include API secret in all requests
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    const response = await fetch(`${apiUrl}/${endpoint}`, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }
    
    return data;
  };

  const refreshProfile = async () => {
    try {
      console.log('PHPAuthProvider: Fetching profile...');
      const response = await makeRequest('api/auth/profile');
      
      if (response.success && response.data?.user) {
        console.log('PHPAuthProvider: Profile loaded:', response.data.user);
        setUser(response.data.user);
      } else {
        console.log('PHPAuthProvider: No profile data received');
        setUser(null);
      }
    } catch (error) {
      console.error('PHPAuthProvider: Error fetching profile:', error);
      
      // Don't show error toast for 401 errors (user not logged in)
      if (error.message !== 'Invalid or expired token') {
        toast.error(`Profile error: ${error.message}`);
      }
      setUser(null);
    }
  };

  useEffect(() => {
    console.log('PHPAuthProvider: Setting up auth check...');
    
    const initializeAuth = async () => {
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        console.log('PHPAuthProvider: Found stored token, verifying...');
        await refreshProfile();
      } else {
        console.log('PHPAuthProvider: No stored token found');
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('PHPAuthProvider: Attempting to sign in:', email);
      setLoading(true);
      
      const response = await makeRequest('api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      if (response.success && response.data) {
        const { user, token, refreshToken } = response.data;
        
        console.log('PHPAuthProvider: Sign in successful:', user.email);
        
        // Store tokens
        localStorage.setItem('auth_token', token);
        localStorage.setItem('refresh_token', refreshToken);
        
        setUser(user);
        
        toast.success('Signed in successfully!');
        return true;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('PHPAuthProvider: Sign in error:', error);
      toast.error(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: string): Promise<boolean> => {
    try {
      console.log('PHPAuthProvider: Attempting to sign up:', email, 'with role:', role);
      setLoading(true);
      
      const response = await makeRequest('api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          fullName,
          role
        }),
      });
      
      if (response.success && response.data) {
        const { user, token, refreshToken } = response.data;
        
        console.log('PHPAuthProvider: Sign up successful:', user.email);
        
        // Store tokens
        localStorage.setItem('auth_token', token);
        localStorage.setItem('refresh_token', refreshToken);
        
        setUser(user);
        
        toast.success('Account created successfully!');
        return true;
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('PHPAuthProvider: Sign up error:', error);
      toast.error(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      console.log('PHPAuthProvider: Signing out...');
      
      // Call logout endpoint
      await makeRequest('api/auth/logout', {
        method: 'POST',
      });
      
      // Clear tokens and user
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      
      console.log('PHPAuthProvider: Sign out successful');
      toast.success('Signed out successfully!');
    } catch (error) {
      console.error('PHPAuthProvider: Sign out error:', error);
      
      // Clear local state even if API call fails
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      
      toast.success('Signed out successfully!');
    }
  };

  const updateProfile = async (profileData: { fullName?: string; phone?: string }): Promise<boolean> => {
    try {
      console.log('PHPAuthProvider: Updating profile...');
      
      const response = await makeRequest('api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
      
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        toast.success('Profile updated successfully!');
        return true;
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error) {
      console.error('PHPAuthProvider: Profile update error:', error);
      toast.error(error.message);
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
      console.log('PHPAuthProvider: Creating demo accounts...');
      let successCount = 0;
      
      for (const user of demoUsers) {
        try {
          await makeRequest('api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
              email: user.email,
              password: user.password,
              fullName: user.fullName,
              role: user.role
            }),
          });
          successCount++;
        } catch (error) {
          // User might already exist - that's okay
          if (error.message.includes('already exists')) {
            console.log('PHPAuthProvider: Demo account already exists:', user.email);
            successCount++;
          } else {
            console.error('PHPAuthProvider: Error creating demo account:', user.email, error);
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
      console.error('PHPAuthProvider: Error in createDemoAccounts:', error);
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

  console.log('PHPAuthProvider: Providing context with state:', { 
    hasUser: !!user, 
    loading,
    userRole: user?.profile?.role
  });

  return (
    <PHPAuthContext.Provider value={value}>
      {children}
    </PHPAuthContext.Provider>
  );
}

export function usePHPAuth() {
  const context = useContext(PHPAuthContext);
  if (context === undefined) {
    throw new Error('usePHPAuth must be used within a PHPAuthProvider');
  }
  return context;
}
