
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

  const refreshProfile = async () => {
    if (!user) {
      setProfile(null);
      return;
    }
    
    try {
      console.log('Fetching profile for user:', user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Profile not found, creating from user metadata:', error);
        // Create profile from user metadata if it doesn't exist
        const userRole = user.user_metadata?.role || 'student';
        const mockProfile = {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email,
          role: userRole,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        console.log('Using mock profile:', mockProfile);
        setProfile(mockProfile);
      } else {
        console.log('Profile loaded:', data);
        setProfile(data);
      }
    } catch (error) {
      console.error('Error in refreshProfile:', error);
      // Fallback to user metadata
      if (user) {
        const userRole = user.user_metadata?.role || 'student';
        const fallbackProfile = {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email,
          role: userRole,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        console.log('Using fallback profile:', fallbackProfile);
        setProfile(fallbackProfile);
      }
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user && event === 'SIGNED_IN') {
        // Immediately set profile from user metadata to avoid delays
        const userRole = session.user.user_metadata?.role || 'student';
        const immediateProfile = {
          id: session.user.id,
          email: session.user.email,
          full_name: session.user.user_metadata?.full_name || session.user.email,
          role: userRole,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        console.log('Setting immediate profile:', immediateProfile);
        setProfile(immediateProfile);
        
        // Then try to fetch from database in background
        setTimeout(() => {
          refreshProfile();
        }, 100);
      } else if (!session?.user) {
        setProfile(null);
      }
      
      setLoading(false);
    });

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Immediately set profile from user metadata
        const userRole = session.user.user_metadata?.role || 'student';
        const immediateProfile = {
          id: session.user.id,
          email: session.user.email,
          full_name: session.user.user_metadata?.full_name || session.user.email,
          role: userRole,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        console.log('Setting initial immediate profile:', immediateProfile);
        setProfile(immediateProfile);
        
        // Then refresh from database
        refreshProfile();
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
        toast.error(error.message);
        setLoading(false);
        return false;
      }

      console.log('Sign in successful:', data);
      toast.success('Signed in successfully!');
      return true;
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      toast.error('An unexpected error occurred');
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
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        toast.error(error.message);
        setLoading(false);
        return false;
      }

      console.log('Sign up successful:', data);
      toast.success('Account created successfully!');
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
          },
        });

        if (error && !error.message.includes('User already registered')) {
          console.error('Error creating demo account:', user.email, error);
          toast.error(`Failed to create ${user.role} account: ${error.message}`);
        } else {
          console.log('Demo account created successfully:', user.email);
        }
        
        await new Promise(resolve => setTimeout(resolve, 500));
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
