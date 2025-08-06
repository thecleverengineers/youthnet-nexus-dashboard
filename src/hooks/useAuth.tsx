
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  profile: any;
  refreshProfile: () => Promise<void>;
  createDemoAccounts: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  const refreshProfile = async (userToFetch?: User) => {
    const currentUser = userToFetch || user;
    if (!currentUser) {
      setProfile(null);
      return;
    }
    
    try {
      console.log('Fetching profile for user:', currentUser.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', currentUser.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile:', error);
        // Wait a moment and try again - the trigger might still be processing
        setTimeout(async () => {
          const { data: retryData, error: retryError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', currentUser.id)
            .maybeSingle();
          
          if (!retryError && retryData) {
            console.log('Profile found on retry:', retryData);
            setProfile(retryData);
          } else {
            console.error('Profile still not found after retry:', retryError);
            setProfile(null);
          }
        }, 2000);
      } else {
        console.log('Profile loaded:', data);
        setProfile(data);
      }
    } catch (error) {
      console.error('Error in refreshProfile:', error);
      setProfile(null);
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Set up auth state listener first
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      setSession(session);
      setUser(session?.user ?? null);
      
      // Refresh profile when user changes
      if (session?.user) {
        // Small delay to ensure the database trigger has completed
        setTimeout(() => {
          refreshProfile(session.user);
        }, 500);
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    // Then get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        refreshProfile(session.user);
      }
      
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting to sign in with:', email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        // Enhanced error messaging
        if (error.message.includes('fetch')) {
          toast.error('Connection failed. Please check your internet connection and try again.');
        } else if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password. Please check your credentials.');
        } else {
          toast.error(error.message);
        }
        setLoading(false);
        return false;
      }

      console.log('Sign in successful:', data);
      
      // Get user profile for personalized welcome message
      const userEmail = data.user?.email;
      const userRole = data.user?.user_metadata?.role || 'user';
      
      // Role-specific welcome messages
      const roleMessages = {
        admin: `Welcome back, Administrator! Accessing your admin dashboard...`,
        staff: `Welcome back, Staff Member! Loading your staff dashboard...`,
        trainer: `Welcome back, Trainer! Opening your training dashboard...`,
        student: `Welcome back, Student! Redirecting to your learning dashboard...`,
        user: `Welcome back! Loading your personalized dashboard...`
      };
      
      const welcomeMessage = roleMessages[userRole as keyof typeof roleMessages] || roleMessages.user;
      
      // Enhanced success toast with role information
      toast.success(welcomeMessage, {
        duration: 2000,
      });
      
      // Trigger redirect after successful login
      setTimeout(() => {
        const currentPath = window.location.pathname;
        if (currentPath === '/' || currentPath === '/auth') {
          window.location.href = '/';
        }
      }, 1500);
      
      return true;
    } catch (error: any) {
      console.error('Unexpected sign in error:', error);
      // Enhanced network error handling
      if (error.message?.includes('fetch') || error.name === 'TypeError') {
        toast.error('Network error: Unable to connect to authentication server. Please check Supabase configuration.');
      } else {
        toast.error('An unexpected error occurred');
      }
      setLoading(false);
      return false;
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: string): Promise<boolean> => {
    try {
      console.log('Attempting to sign up:', email, 'with role:', role);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        toast.error(error.message);
        setLoading(false);
        return false;
      }

      console.log('Sign up successful:', data);
      
      if (data.user && !data.session) {
        toast.success('Account created! Please check your email to verify your account.');
      } else {
        toast.success('Account created successfully!');
      }
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Unexpected sign up error:', error);
      toast.error('An unexpected error occurred');
      setLoading(false);
      return false;
    }
  };

  const createDemoAccounts = async (): Promise<boolean> => {
    const demoUsers = [
      { email: 'admin@youthnet.in', password: 'admin123', role: 'admin', name: 'Admin User' },
      { email: 'staff@youthnet.in', password: 'staff123', role: 'staff', name: 'Staff User' },
      { email: 'trainer@youthnet.in', password: 'trainer123', role: 'trainer', name: 'Trainer User' },
      { email: 'student@youthnet.in', password: 'student123', role: 'student', name: 'Student User' },
    ];

    try {
      setLoading(true);
      toast.info('Creating demo accounts...');
      
      for (const user of demoUsers) {
        console.log('Creating demo account for:', user.email);
        
        const { data, error } = await supabase.auth.signUp({
          email: user.email,
          password: user.password,
          options: {
            data: {
              full_name: user.name,
              role: user.role,
            },
            emailRedirectTo: `${window.location.origin}/`,
          },
        });

        if (error && !error.message.includes('User already registered')) {
          console.error('Error creating demo account:', user.email, error);
          toast.error(`Failed to create ${user.role} account: ${error.message}`);
        } else {
          console.log('Demo account created successfully:', user.email);
        }
        
        // Add delay between account creations to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      setLoading(false);
      toast.success('Demo accounts created successfully! You can now use the demo login buttons.');
      return true;
    } catch (error) {
      console.error('Error in createDemoAccounts:', error);
      toast.error('Failed to create demo accounts');
      setLoading(false);
      return false;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        toast.error(error.message);
      } else {
        console.log('Sign out successful');
        toast.success('Signed out successfully!');
        setProfile(null);
      }
    } catch (error) {
      console.error('Unexpected sign out error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    profile,
    refreshProfile,
    createDemoAccounts,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
