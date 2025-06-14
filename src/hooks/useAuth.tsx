
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        // If profile doesn't exist, create it
        if (error.code === 'PGRST116') {
          await createUserProfile(user);
        }
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error in refreshProfile:', error);
    }
  };

  const createUserProfile = async (user: User) => {
    try {
      // Extract role from user metadata or default to student
      const userRole = user.user_metadata?.role || 'student';
      
      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || user.email || '',
          role: userRole
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        return;
      }

      // Create role-specific records
      await createRoleSpecificRecord(user, userRole);
      
      // Refresh profile after creation
      await refreshProfile();
    } catch (error) {
      console.error('Error in createUserProfile:', error);
    }
  };

  const createRoleSpecificRecord = async (user: User, role: string) => {
    const email = user.email || '';
    const timestamp = Date.now().toString().slice(-6);
    
    try {
      switch (role) {
        case 'student':
          await supabase
            .from('students')
            .insert({
              user_id: user.id,
              student_id: `STU${email.substring(0, 3).toUpperCase()}${timestamp}`,
              enrollment_date: new Date().toISOString().split('T')[0],
              status: 'pending'
            });
          break;
          
        case 'trainer':
          await supabase
            .from('trainers')
            .insert({
              user_id: user.id,
              trainer_id: `TRA${email.substring(0, 3).toUpperCase()}${timestamp}`,
              specialization: 'General Training',
              hire_date: new Date().toISOString().split('T')[0],
              status: 'active'
            });
          break;
          
        case 'staff':
          await supabase
            .from('employees')
            .insert({
              user_id: user.id,
              employee_id: `EMP${email.substring(0, 3).toUpperCase()}${timestamp}`,
              position: 'Staff Member',
              department: 'General',
              employment_status: 'active',
              employment_type: 'full_time',
              hire_date: new Date().toISOString().split('T')[0],
              salary: 40000
            });
          break;
          
        case 'admin':
          await supabase
            .from('employees')
            .insert({
              user_id: user.id,
              employee_id: `ADM${email.substring(0, 3).toUpperCase()}${timestamp}`,
              position: 'Administrator',
              department: 'Administration',
              employment_status: 'active',
              employment_type: 'full_time',
              hire_date: new Date().toISOString().split('T')[0],
              salary: 60000
            });
          break;
          
        default:
          // Default to student
          await supabase
            .from('students')
            .insert({
              user_id: user.id,
              student_id: `STU${email.substring(0, 3).toUpperCase()}${timestamp}`,
              enrollment_date: new Date().toISOString().split('T')[0],
              status: 'pending'
            });
          break;
      }
    } catch (error) {
      console.error('Error creating role-specific record:', error);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      refreshProfile();
    } else {
      setProfile(null);
    }
  }, [user]);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Signed in successfully!');
      return true;
    } catch (error) {
      toast.error('An unexpected error occurred');
      return false;
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signUp({
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
        toast.error(error.message);
        return false;
      }

      toast.success('Account created successfully! Please check your email to verify your account.');
      return true;
    } catch (error) {
      toast.error('An unexpected error occurred');
      return false;
    }
  };

  const signOut = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Signed out successfully!');
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
