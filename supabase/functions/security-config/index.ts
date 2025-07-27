import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

interface SecurityConfigRequest {
  action: 'audit_log' | 'security_check' | 'user_activity';
  data?: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Get user profile to check permissions
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      throw new Error('Profile not found');
    }

    // Only admin users can access security configurations
    if (profile.role !== 'admin') {
      throw new Error('Insufficient permissions');
    }

    const { action, data }: SecurityConfigRequest = await req.json();

    let response: any = {};

    switch (action) {
      case 'audit_log': {
        // Log security events
        const { error: logError } = await supabaseClient
          .from('security_audit_log')
          .insert({
            user_id: user.id,
            action: data.event_type || 'security_check',
            table_name: data.table_name,
            record_id: data.record_id,
            new_values: data.details,
            ip_address: req.headers.get('x-forwarded-for') || 
                       req.headers.get('x-real-ip') || 
                       'unknown',
            user_agent: req.headers.get('user-agent') || 'unknown'
          });

        if (logError) {
          console.error('Audit log error:', logError);
          throw new Error('Failed to create audit log');
        }

        response = { success: true, message: 'Audit log created' };
        break;
      }

      case 'security_check': {
        // Perform security health check
        const checks = [];

        // Check for users without proper role assignments
        const { data: usersWithoutRoles, error: roleError } = await supabaseClient
          .from('profiles')
          .select('id, email, role')
          .is('role', null);

        if (!roleError && usersWithoutRoles?.length > 0) {
          checks.push({
            severity: 'high',
            issue: 'Users without assigned roles',
            count: usersWithoutRoles.length,
            users: usersWithoutRoles.map(u => u.email)
          });
        }

        // Check for inactive users with admin roles
        const { data: inactiveAdmins, error: adminError } = await supabaseClient
          .from('profiles')
          .select('id, email, updated_at')
          .eq('role', 'admin')
          .lt('updated_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString());

        if (!adminError && inactiveAdmins?.length > 0) {
          checks.push({
            severity: 'medium',
            issue: 'Inactive admin users (90+ days)',
            count: inactiveAdmins.length,
            users: inactiveAdmins.map(u => u.email)
          });
        }

        // Check for failed login attempts
        const { data: failedLogins, error: loginError } = await supabaseClient
          .from('user_activities')
          .select('user_id, activity_date, ip_address')
          .eq('activity_type', 'failed_login')
          .gte('activity_date', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

        if (!loginError && failedLogins?.length > 10) {
          checks.push({
            severity: 'high',
            issue: 'High number of failed login attempts in last 24h',
            count: failedLogins.length
          });
        }

        response = {
          success: true,
          securityChecks: checks,
          timestamp: new Date().toISOString()
        };
        break;
      }

      case 'user_activity': {
        // Log user activity for security monitoring
        const { error: activityError } = await supabaseClient
          .from('user_activities')
          .insert({
            user_id: user.id,
            activity_type: data.activity_type || 'general',
            activity_date: new Date().toISOString(),
            ip_address: req.headers.get('x-forwarded-for') || 
                       req.headers.get('x-real-ip') || 
                       'unknown',
            device_info: {
              user_agent: req.headers.get('user-agent') || 'unknown',
              timestamp: new Date().toISOString()
            }
          });

        if (activityError) {
          console.error('Activity log error:', activityError);
          throw new Error('Failed to log user activity');
        }

        response = { success: true, message: 'User activity logged' };
        break;
      }

      default:
        throw new Error('Invalid action');
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );

  } catch (error) {
    console.error('Security config error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message === 'Unauthorized' || error.message === 'Insufficient permissions' ? 403 : 500,
      },
    );
  }
});