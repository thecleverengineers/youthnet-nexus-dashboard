
import { supabase } from '@/integrations/supabase/client';

export interface CreateUserData {
  email: string;
  password: string;
  fullName: string;
  role: 'student' | 'trainer' | 'staff' | 'admin';
}

export const authService = {
  async createUserWithRole(userData: CreateUserData) {
    try {
      // Create the user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.fullName,
            role: userData.role,
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error('User creation failed');
      }

      console.log(`User created with role: ${userData.role}`);
      return { user: authData.user, error: null };
    } catch (error) {
      console.error('Error creating user:', error);
      return { user: null, error };
    }
  },

  async ensureUserProfile(userId: string, userData: Partial<CreateUserData>) {
    try {
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (existingProfile) {
        console.log('Profile already exists');
        return { profile: existingProfile, error: null };
      }

      // Create profile if it doesn't exist
      const { data: newProfile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: userData.email || null,
          full_name: userData.fullName || 'User',
          role: userData.role || 'student',
          phone: null
        })
        .select()
        .single();

      if (profileError) {
        throw profileError;
      }

      console.log('Profile created successfully');
      return { profile: newProfile, error: null };
    } catch (error) {
      console.error('Error ensuring user profile:', error);
      return { profile: null, error };
    }
  }
};
