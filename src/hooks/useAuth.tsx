
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<boolean>;
  createDemoAccounts: () => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.log('Profile error:', profileError);
        
        if (profileError.code === 'PGRST116') {
          console.log('Creating new profile for user:', userId);
          
          const { data: userData } = await supabase.auth.getUser();
          const userEmail = userData.user?.email;
          const userMetadata = userData.user?.user_metadata;
          
          const newProfile = {
            id: userId,
            email: userEmail || null,
            full_name: userMetadata?.full_name || userEmail?.split('@')[0] || 'User',
            role: userMetadata?.role || 'student',
            phone: userMetadata?.phone || null
          };

          const { data: createdProfile, error: createError } = await supabase
            .from('profiles')
            .insert(newProfile)
            .select()
            .single();

          if (createError) {
            console.error('Error creating profile:', createError);
            return null;
          }

          console.log('Profile created successfully:', createdProfile);
          return createdProfile;
        }
        return null;
      }

      console.log('Profile fetched successfully:', profileData);
      return profileData;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting sign in for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        console.log('Sign in successful:', data.user.id);
        toast.success('Signed in successfully!');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Failed to sign in');
      return false;
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: string): Promise<boolean> => {
    try {
      console.log('Attempting sign up for:', email, 'with role:', role);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        console.log('Sign up successful:', data.user.id);
        toast.success('Account created successfully!');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error('Failed to create account');
      return false;
    }
  };

  const createDemoAccounts = async (): Promise<boolean> => {
    try {
      console.log('Creating demo accounts...');

      const demoUsers = [
        { email: 'admin@youthnet.in', password: 'admin123', fullName: 'Admin User', role: 'admin' },
        { email: 'staff@youthnet.in', password: 'staff123', fullName: 'Staff Member', role: 'staff' },
        { email: 'trainer@youthnet.in', password: 'trainer123', fullName: 'Trainer User', role: 'trainer' },
        { email: 'student@youthnet.in', password: 'student123', fullName: 'Student User', role: 'student' },
      ];

      let successCount = 0;
      
      for (const demoUser of demoUsers) {
        try {
          const { data, error } = await supabase.auth.signUp({
            email: demoUser.email,
            password: demoUser.password,
            options: {
              data: {
                full_name: demoUser.fullName,
                role: demoUser.role,
              },
              emailRedirectTo: `${window.location.origin}/`
            }
          });

          if (!error) {
            successCount++;
            console.log(`Demo user created: ${demoUser.email}`);
          } else if (error.message.includes('already registered')) {
            console.log(`Demo user already exists: ${demoUser.email}`);
            successCount++;
          } else {
            console.error(`Error creating ${demoUser.email}:`, error);
          }
        } catch (err) {
          console.error(`Error creating ${demoUser.email}:`, err);
        }
      }

      if (successCount > 0) {
        toast.success(`Demo accounts ready! (${successCount}/${demoUsers.length})`);
        return true;
      } else {
        toast.error('Failed to create demo accounts');
        return false;
      }
    } catch (error) {
      console.error('Error creating demo accounts:', error);
      toast.error('Failed to create demo accounts');
      return false;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      setProfile(null);
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    }
  };

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          setTimeout(async () => {
            if (mounted) {
              const profileData = await fetchProfile(session.user.id);
              if (mounted) {
                setProfile(profileData);
              }
            }
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;

      console.log('Initial session check:', session?.user?.id);
      
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        setTimeout(async () => {
          if (mounted) {
            const profileData = await fetchProfile(session.user.id);
            if (mounted) {
              setProfile(profileData);
            }
          }
        }, 0);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    profile,
    signIn,
    signUp,
    createDemoAccounts,
    signOut,
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
