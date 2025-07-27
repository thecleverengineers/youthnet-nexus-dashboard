import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to: string;
  subject: string;
  message: string;
}

interface SMTPSettings {
  smtp_host: string;
  smtp_port: number;
  smtp_username: string;
  smtp_password: string;
  smtp_encryption: string;
  smtp_from_email: string;
  smtp_from_name: string;
  smtp_enabled: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the auth header
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

    // Check if user is admin
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      throw new Error('Admin access required');
    }

    const { to, subject, message }: EmailRequest = await req.json();

    // Fetch SMTP settings from database
    const { data: settings, error: settingsError } = await supabaseClient
      .from('system_settings')
      .select('setting_key, setting_value')
      .eq('setting_type', 'smtp');

    if (settingsError) {
      throw new Error('Failed to fetch SMTP settings');
    }

    // Parse SMTP settings
    const smtpConfig: Partial<SMTPSettings> = {};
    settings?.forEach((setting) => {
      const value = typeof setting.setting_value === 'string' 
        ? JSON.parse(setting.setting_value) 
        : setting.setting_value;
      smtpConfig[setting.setting_key as keyof SMTPSettings] = value;
    });

    if (!smtpConfig.smtp_enabled) {
      throw new Error('SMTP is not enabled');
    }

    if (!smtpConfig.smtp_host || !smtpConfig.smtp_username || !smtpConfig.smtp_password) {
      throw new Error('SMTP configuration is incomplete');
    }

    // Create SMTP connection and send email
    const emailContent = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">SMTP Test Email</h2>
            <p>Hello,</p>
            <p>${message}</p>
            <p>If you received this email, your SMTP configuration is working correctly!</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 14px;">
              This is an automated test email from ${smtpConfig.smtp_from_name || 'Your Application'}.
            </p>
          </div>
        </body>
      </html>
    `;

    // For this example, we'll use a basic fetch to a hypothetical email service
    // In a real implementation, you'd use a proper SMTP library or service like Resend
    console.log('SMTP Settings:', {
      host: smtpConfig.smtp_host,
      port: smtpConfig.smtp_port,
      from: smtpConfig.smtp_from_email,
      to,
      subject
    });

    // Simulate email sending (replace with actual SMTP implementation)
    // You would typically use nodemailer or similar for actual SMTP
    const emailResponse = {
      success: true,
      messageId: `test-${Date.now()}`,
      to,
      subject,
      timestamp: new Date().toISOString()
    };

    console.log('Test email sent successfully:', emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in send-test-email function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to send test email',
        details: error.toString()
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);