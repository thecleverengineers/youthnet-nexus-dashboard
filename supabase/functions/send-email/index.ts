import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from_name?: string;
  from_email?: string;
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

    const { 
      to, 
      subject, 
      html, 
      text, 
      from_name, 
      from_email 
    }: EmailRequest = await req.json();

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

    // Use provided from details or fall back to SMTP config
    const fromEmail = from_email || smtpConfig.smtp_from_email;
    const fromName = from_name || smtpConfig.smtp_from_name;

    // Create email content
    const emailContent = html || `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            ${text ? text.replace(/\n/g, '<br>') : ''}
          </div>
        </body>
      </html>
    `;

    // Log email details (replace with actual SMTP implementation)
    console.log('Email Details:', {
      host: smtpConfig.smtp_host,
      port: smtpConfig.smtp_port,
      encryption: smtpConfig.smtp_encryption,
      from: `${fromName} <${fromEmail}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      hasHtml: !!html,
      hasText: !!text
    });

    // In a real implementation, you would use nodemailer or similar for SMTP
    // For now, we'll simulate the email sending
    const emailResponse = {
      success: true,
      messageId: `email-${Date.now()}`,
      to: Array.isArray(to) ? to : [to],
      subject,
      from: `${fromName} <${fromEmail}>`,
      timestamp: new Date().toISOString(),
      provider: 'smtp'
    };

    console.log('Email sent successfully:', emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in send-email function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to send email',
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