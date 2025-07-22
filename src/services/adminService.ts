
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
  },

  async initializeDefaultAdmin() {
    try {
      // Check if the default admin already exists
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'thecleverengineers@gmail.com',
        password: 'Kites@123',
      });

      if (!error && data.user) {
        console.log('Default admin user already exists');
        await supabase.auth.signOut(); // Sign out after checking
        return { success: true, message: 'Default admin already exists' };
      }

      // Create the default admin user
      const result = await this.createAdminUser({
        email: 'thecleverengineers@gmail.com',
        password: 'Kites@123',
        fullName: 'System Administrator'
      });

      if (result.error) {
        throw result.error;
      }

      return { success: true, message: 'Default admin user created successfully' };
    } catch (error: any) {
      console.error('Error initializing default admin:', error);
      return { success: false, error: error.message };
    }
  }
};
