
import { supabase } from '@/integrations/supabase/client';

export interface CreateAdminUserData {
  email: string;
  password: string;
  fullName: string;
}

export const adminService = {
  async createAdminUser(userData: CreateAdminUserData) {
    try {
      console.log('Creating admin user:', userData.email);
      
      // Validate input data
      if (!userData.email || !userData.password || !userData.fullName) {
        throw new Error('All user data fields are required');
      }

      if (userData.password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      // Create the user account with admin role
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.fullName,
            role: 'admin',
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Admin user creation failed');
      }

      console.log(`Admin user created successfully: ${userData.email}`);
      return { user: authData.user, error: null };
    } catch (error) {
      console.error('Error creating admin user:', error);
      return { user: null, error };
    }
  }

  // NOTE: Removed initializeDefaultAdmin to eliminate hardcoded credentials security risk
  // Admin users should be created manually through proper registration flows
};
