import { useAuth } from '@/hooks/useAuth';
import { useMongoAuth } from '@/hooks/useMongoAuth';
import { isMongoDBAuth } from '@/config/auth';

/**
 * Unified auth hook that automatically switches between Supabase and MongoDB
 * based on the configuration in src/config/auth.ts
 */
export function useUnifiedAuth() {
  const supabaseAuth = useAuth();
  const mongoAuth = useMongoAuth();
  
  // Return the appropriate auth provider based on configuration
  return isMongoDBAuth() ? mongoAuth : supabaseAuth;
}