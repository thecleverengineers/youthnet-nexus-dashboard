
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
  console.log('AuthProvider: Initializing...');
  
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  const refreshProfile = async () => {
    if (!user) {
      console.log('AuthProvider: No user to refresh profile for');
      setProfile(null);
      return;
    }
    
    try {
      console.log('AuthProvider: Fetching profile for user:', user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('AuthProvider: Error fetching profile:', error);
        
        // Try to create profile if it doesn't exist
        if (error.code === 'PGRST116') {
          console.log('AuthProvider: Profile not found, attempting to create...');
          
          // Wait a bit and try again - the trigger might be processing
          setTimeout(async () => {
            const { data: retryData, error: retryError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .single();
            
            if (!retryError && retryData) {
              console.log('AuthProvider: Profile found on retry:', retryData);
              setProfile(retryData);
            } else {
              console.error('AuthProvider: Profile still not found after retry. Creating manually...');
              
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
                console.log('AuthProvider: Profile created manually:', createdProfile);
                setProfile(createdProfile);
                toast.success('Profile created successfully!');
              } else {
                console.error('AuthProvider: Failed to create profile manually:', createError);
                toast.error('Failed to create profile. Please try signing in again.');
              }
            }
          }, 3000);
        }
      } else {
        console.log('AuthProvider: Profile loaded successfully:', data);
        setProfile(data);
      }
    } catch (error) {
      console.error('AuthProvider: Error in refreshProfile:', error);
      toast.error('Error loading profile. Please refresh the page.');
    }
  };

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener...');
    
    let mounted = true;
    
    // Set up auth state listener first
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthProvider: Auth state changed:', event, session?.user?.email);
      
      if (!mounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      
      // Handle profile refresh based on auth events
      if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        console.log('AuthProvider: User signed in, refreshing profile after delay');
        // Small delay to ensure the database trigger has completed
        setTimeout(() => {
          if (mounted) {
            refreshProfile();
          }
        }, 1000);
      } else if (event === 'SIGNED_OUT') {
        console.log('AuthProvider: User signed out, clearing profile');
        setProfile(null);
      }
      
      // Set loading to false after processing auth state change
      if (mounted) {
        setLoading(false);
      }
    });

    // Then get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('AuthProvider: Initial session check:', session?.user?.email);
      
      if (!mounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('AuthProvider: Initial session found, refreshing profile');
        refreshProfile();
      }
      
      setLoading(false);
    });

    return () => {
      console.log('AuthProvider: Cleaning up auth subscription');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('AuthProvider: Attempting to sign in with:', email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('AuthProvider: Sign in error:', error);
        
        // Handle specific error cases
        if (error.message.includes('Email not confirmed')) {
          toast.error('Please check your email and confirm your account, or use the demo accounts.');
        } else if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password. Please check your credentials.');
        } else {
          toast.error(error.message);
        }
        setLoading(false);
        return false;
      }

      console.log('AuthProvider: Sign in successful:', data.user?.email);
      toast.success('Signed in successfully!');
      return true;
    } catch (error) {
      console.error('AuthProvider: Unexpected sign in error:', error);
      toast.error('An unexpected error occurred');
      setLoading(false);
      return false;
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: string): Promise<boolean> => {
    try {
      console.log('AuthProvider: Attempting to sign up:', email, 'with role:', role);
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
        console.error('AuthProvider: Sign up error:', error);
        toast.error(error.message);
        setLoading(false);
        return false;
      }

      console.log('AuthProvider: Sign up successful:', data.user?.email);
      
      if (data.user && !data.user.email_confirmed_at) {
        toast.success('Account created! Please check your email to confirm your account.');
      } else {
        toast.success('Account created successfully!');
      }
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error('AuthProvider: Unexpected sign up error:', error);
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
      
      let successCount = 0;
      
      for (const user of demoUsers) {
        console.log('AuthProvider: Creating demo account for:', user.email);
        
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

        if (error) {
          if (error.message.includes('User already registered')) {
            console.log('AuthProvider: Demo account already exists:', user.email);
            successCount++;
          } else {
            console.error('AuthProvider: Error creating demo account:', user.email, error);
            toast.error(`Failed to create ${user.role} account: ${error.message}`);
          }
        } else {
          console.log('AuthProvider: Demo account created successfully:', user.email);
          successCount++;
        }
        
        // Add delay between account creations to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      setLoading(false);
      
      if (successCount === demoUsers.length) {
        toast.success('All demo accounts are ready! You can now use the demo login buttons.');
        return true;
      } else if (successCount > 0) {
        toast.success(`${successCount} demo accounts are ready! You can now use the demo login buttons.`);
        return true;
      } else {
        toast.error('Failed to create demo accounts');
        return false;
      }
    } catch (error) {
      console.error('AuthProvider: Error in createDemoAccounts:', error);
      toast.error('Failed to create demo accounts');
      setLoading(false);
      return false;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      console.log('AuthProvider: Signing out...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('AuthProvider: Sign out error:', error);
        toast.error(error.message);
      } else {
        console.log('AuthProvider: Sign out successful');
        toast.success('Signed out successfully!');
        setProfile(null);
      }
    } catch (error) {
      console.error('AuthProvider: Unexpected sign out error:', error);
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

  console.log('AuthProvider: Providing context with state:', { 
    hasUser: !!user, 
    hasProfile: !!profile, 
    loading 
  });

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
