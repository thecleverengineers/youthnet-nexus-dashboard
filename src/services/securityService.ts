import { supabase } from '@/integrations/supabase/client';

export interface SecurityCheck {
  severity: 'low' | 'medium' | 'high' | 'critical';
  issue: string;
  count?: number;
  users?: string[];
  details?: any;
}

export interface SecurityAuditLog {
  user_id: string;
  action: string;
  table_name?: string;
  record_id?: string;
  details?: any;
}

export const securityService = {
  // Log security events
  async logSecurityEvent(eventData: SecurityAuditLog) {
    try {
      const { data, error } = await supabase.functions.invoke('security-config', {
        body: {
          action: 'audit_log',
          data: {
            event_type: eventData.action,
            table_name: eventData.table_name,
            record_id: eventData.record_id,
            details: eventData.details
          }
        }
      });

      if (error) {
        console.error('Security log error:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error: any) {
      console.error('Security service error:', error);
      return { success: false, error: error.message };
    }
  },

  // Perform comprehensive security check
  async performSecurityCheck() {
    try {
      const { data, error } = await supabase.functions.invoke('security-config', {
        body: {
          action: 'security_check'
        }
      });

      if (error) {
        console.error('Security check error:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error: any) {
      console.error('Security check service error:', error);
      return { success: false, error: error.message };
    }
  },

  // Log user activity for monitoring
  async logUserActivity(activityType: string, details?: any) {
    try {
      const { data, error } = await supabase.functions.invoke('security-config', {
        body: {
          action: 'user_activity',
          data: {
            activity_type: activityType,
            details
          }
        }
      });

      if (error) {
        console.error('User activity log error:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error: any) {
      console.error('User activity service error:', error);
      return { success: false, error: error.message };
    }
  },

  // Check for common security issues locally
  async quickSecurityScan() {
    const issues: SecurityCheck[] = [];

    try {
      // Check current user's session security
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const tokenAge = Date.now() - (session.expires_at ? session.expires_at * 1000 : 0);
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours

        if (tokenAge > maxAge) {
          issues.push({
            severity: 'medium',
            issue: 'Session token is old and should be refreshed',
            details: { tokenAge, maxAge }
          });
        }
      }

      // Basic profile validation
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, phone, updated_at')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          // Check if role is properly set
          if (!profile.role || !['student', 'trainer', 'staff', 'admin'].includes(profile.role)) {
            issues.push({
              severity: 'high',
              issue: 'User has invalid or missing role assignment'
            });
          }

          // Check if profile is updated recently
          const profileAge = Date.now() - new Date(profile.updated_at).getTime();
          const staleThreshold = 365 * 24 * 60 * 60 * 1000; // 1 year

          if (profileAge > staleThreshold) {
            issues.push({
              severity: 'low',
              issue: 'User profile has not been updated in over a year'
            });
          }
        }
      }

      return {
        success: true,
        data: {
          issues,
          timestamp: new Date().toISOString(),
          summary: {
            total: issues.length,
            high: issues.filter(i => i.severity === 'high').length,
            medium: issues.filter(i => i.severity === 'medium').length,
            low: issues.filter(i => i.severity === 'low').length
          }
        }
      };

    } catch (error: any) {
      console.error('Quick security scan error:', error);
      return {
        success: false,
        error: error.message,
        data: { issues: [], timestamp: new Date().toISOString() }
      };
    }
  },

  // Rate limiting check (client-side)
  rateLimit: {
    attempts: new Map<string, { count: number; timestamp: number }>(),
    
    isAllowed(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
      const now = Date.now();
      const record = this.attempts.get(key);

      if (!record || (now - record.timestamp) > windowMs) {
        // Reset or create new record
        this.attempts.set(key, { count: 1, timestamp: now });
        return true;
      }

      if (record.count >= maxAttempts) {
        return false;
      }

      record.count += 1;
      return true;
    },

    reset(key: string): void {
      this.attempts.delete(key);
    }
  }
};