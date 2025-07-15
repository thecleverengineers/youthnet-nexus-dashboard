
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
        console.error('Error fetching profile:', error);
        
        // Try to create profile if it doesn't exist
        if (error.code === 'PGRST116') {
          console.log('Profile not found, attempting to create...');
          
          // Wait a bit and try again - the trigger might be processing
          setTimeout(async () => {
            const { data: retryData, error: retryError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .single();
            
            if (!retryError && retryData) {
              console.log('Profile found on retry:', retryData);
              setProfile(retryData);
            } else {
              console.error('Profile still not found after retry. Creating manually...');
              
              // Try to create profile manually if trigger failed
              const userMetadata = user.user_metadata || {};
              const role = userMetadata.role || 'student';
              
              const { data: createdProfile, error: createError } = await supabase
                .from('profiles')
                .insert({
                  id: user.id,
                  email: user.email,
                  full_name: userMetadata.full_name || user.email,
                  role: role
                })
                .select()
                .single();
              
              if (!createError && createdProfile) {
                console.log('Profile created manually:', createdProfile);
                setProfile(createdProfile);
                toast.success('Profile created successfully!');
              } else {
                console.error('Failed to create profile manually:', createError);
                toast.error('Failed to create profile. Please try signing in again.');
              }
            }
          }, 3000);
        }
      } else {
        console.log('Profile loaded:', data);
        setProfile(data);
      }
    } catch (error) {
      console.error('Error in refreshProfile:', error);
      toast.error('Error loading profile. Please refresh the page.');
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Set up auth state listener first
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Refresh profile when user changes
      if (session?.user && event === 'SIGNED_IN') {
        // Small delay to ensure the database trigger has completed
        setTimeout(() => {
          refreshProfile();
        }, 1000);
      } else {
        setProfile(null);
      }
    });

    // Then get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        refreshProfile();
      }
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

      console.log('Sign in successful:', data.user?.id);
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

      console.log('Sign up successful:', data.user?.id);
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
        
        // Add delay between account creations to avoid rate limiting
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
