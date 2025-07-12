
import { useAuth } from '@/hooks/useAuth';
import { useMongoAuth } from '@/hooks/useMongoAuth';
import { isMongoDBAuth } from '@/config/auth';

/**
 * Unified auth hook that automatically switches between Supabase and MongoDB
 * based on the configuration in src/config/auth.ts
 */
export function useUnifiedAuth() {
  // Only call the auth hook for the configured provider to avoid errors
  if (isMongoDBAuth()) {
    const mongoAuth = useMongoAuth();
    return {
      ...mongoAuth,
      isOnline: mongoAuth.isOnline ?? navigator.onLine,
      retryConnection: mongoAuth.retryConnection ?? (() => Promise.resolve()),
    };
  } else {
    const supabaseAuth = useAuth();
    return {
      ...supabaseAuth,
      isOnline: navigator.onLine,
      retryConnection: () => Promise.resolve(),
    };
  }
}
