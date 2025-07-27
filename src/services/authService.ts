import { supabase } from '@/integrations/supabase/client';
import { createUserSchema, validateAndSanitize, sanitizeInput, type CreateUserData } from '@/lib/validation';

export const authService = {
  async createUserWithRole(userData: CreateUserData) {
    try {
      // Validate and sanitize input data
      const validation = validateAndSanitize(createUserSchema, userData);
      if (!validation.success) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      const validatedData = validation.data;

      // Additional sanitization
      const sanitizedData = {
        email: validatedData.email.toLowerCase().trim(),
        password: validatedData.password,
        fullName: sanitizeInput(validatedData.fullName),
        role: validatedData.role
      };

      // Create the user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: sanitizedData.email,
        password: sanitizedData.password,
        options: {
          data: {
            full_name: sanitizedData.fullName,
            role: sanitizedData.role,
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

      console.log(`User created with role: ${sanitizedData.role}`);
      return { user: authData.user, error: null };
    } catch (error) {
      console.error('Error creating user:', error);
      return { user: null, error };
    }
  },

  async ensureUserProfile(userId: string, userData: Partial<CreateUserData>) {
    try {
      // Sanitize input data
      const sanitizedUserData = {
        email: userData.email ? userData.email.toLowerCase().trim() : null,
        fullName: userData.fullName ? sanitizeInput(userData.fullName) : 'User',
        role: userData.role || 'student'
      };

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
          email: sanitizedUserData.email,
          full_name: sanitizedUserData.fullName,
          role: sanitizedUserData.role,
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