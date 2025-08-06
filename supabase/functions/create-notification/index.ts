import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  user_id?: string;
  user_ids?: string[];
  role?: string;
  title: string;
  message: string;
  type?: string;
  priority?: string;
  action_url?: string;
  action_label?: string;
  metadata?: Record<string, any>;
  expires_at?: string;
  send_email?: boolean;
  email_template?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const {
      user_id,
      user_ids,
      role,
      title,
      message,
      type = 'info',
      priority = 'normal',
      action_url,
      action_label,
      metadata,
      expires_at,
      send_email = false,
      email_template
    }: NotificationRequest = await req.json();

    console.log('Creating notification:', { title, type, priority });

    let targetUsers: string[] = [];

    // Determine target users
    if (user_id) {
      targetUsers = [user_id];
    } else if (user_ids) {
      targetUsers = user_ids;
    } else if (role) {
      // Get users by role
      const { data: users } = await supabaseClient
        .from('profiles')
        .select('user_id')
        .eq('role', role);
      
      targetUsers = users?.map(u => u.user_id) || [];
    }

    if (targetUsers.length === 0) {
      throw new Error('No target users specified');
    }

    // Create notifications for each user
    const notifications = targetUsers.map(userId => ({
      user_id: userId,
      title,
      message,
      type,
      priority,
      action_url,
      action_label,
      metadata,
      expires_at
    }));

    const { data: createdNotifications, error } = await supabaseClient
      .from('notifications')
      .insert(notifications)
      .select();

    if (error) {
      console.error('Failed to create notifications:', error);
      throw error;
    }

    console.log(`Created ${createdNotifications?.length} notifications`);

    // Send emails if requested
    if (send_email && email_template) {
      const { data: profiles } = await supabaseClient
        .from('profiles')
        .select('user_id, full_name, email')
        .in('user_id', targetUsers);

      if (profiles) {
        // Send emails in background
        EdgeRuntime.waitUntil(
          Promise.all(profiles.map(async (profile) => {
            try {
              const emailResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-notification-email`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
                },
                body: JSON.stringify({
                  template_name: email_template,
                  recipient_email: profile.email,
                  recipient_name: profile.full_name,
                  variables: {
                    name: profile.full_name,
                    title,
                    message,
                    action_url,
                    action_label
                  }
                })
              });

              if (!emailResponse.ok) {
                console.error('Failed to send email to:', profile.email);
              }
            } catch (emailError) {
              console.error('Email sending error:', emailError);
            }
          }))
        );
      }
    }

    return new Response(JSON.stringify({
      success: true,
      count: createdNotifications?.length || 0,
      notifications: createdNotifications
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error creating notification:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to create notification' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});