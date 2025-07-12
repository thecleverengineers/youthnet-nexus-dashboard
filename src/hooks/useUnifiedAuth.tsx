
import { useAuth } from '@/hooks/useAuth';
import { useMongoAuth } from '@/hooks/useMongoAuth';
import { usePHPAuth } from '@/hooks/usePHPAuth';
import { isMongoDBAuth, isSupabaseAuth, isPHPAuth } from '@/config/auth';

/**
 * Unified auth hook that automatically switches between Supabase, MongoDB, and PHP
 * based on the configuration in src/config/auth.ts
 */
export function useUnifiedAuth() {
  // Only call the auth hook for the configured provider to avoid errors
  if (isPHPAuth()) {
    const phpAuth = usePHPAuth();
    return phpAuth;
  } else if (isMongoDBAuth()) {
    const mongoAuth = useMongoAuth();
    return mongoAuth;
  } else {
    const supabaseAuth = useAuth();
    return supabaseAuth;
  }
}
