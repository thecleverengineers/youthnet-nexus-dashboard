import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  template_name: string;
  recipient_email: string;
  recipient_name?: string;
  variables: Record<string, any>;
}

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

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

    const { template_name, recipient_email, recipient_name, variables }: EmailRequest = await req.json();

    console.log('Sending email with template:', template_name, 'to:', recipient_email);

    // Get email template
    const { data: template, error: templateError } = await supabaseClient
      .from('email_templates')
      .select('*')
      .eq('name', template_name)
      .eq('status', 'active')
      .single();

    if (templateError || !template) {
      console.error('Template not found:', templateError);
      throw new Error(`Email template '${template_name}' not found`);
    }

    // Replace variables in template
    let htmlContent = template.html_content;
    let textContent = template.text_content || '';
    let subject = template.subject;

    // Replace variables using simple string replacement
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      htmlContent = htmlContent.replace(new RegExp(placeholder, 'g'), String(value));
      textContent = textContent.replace(new RegExp(placeholder, 'g'), String(value));
      subject = subject.replace(new RegExp(placeholder, 'g'), String(value));
    });

    // Create email log entry
    const { data: emailLog, error: logError } = await supabaseClient
      .from('email_logs')
      .insert({
        template_id: template.id,
        recipient_email,
        recipient_name,
        subject,
        status: 'pending',
        variables_used: variables
      })
      .select()
      .single();

    if (logError) {
      console.error('Failed to create email log:', logError);
    }

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: 'YouthNet <noreply@youthnet.in>',
      to: [recipient_email],
      subject,
      html: htmlContent,
      text: textContent,
    });

    console.log('Email sent successfully:', emailResponse);

    // Update email log with success
    if (emailLog) {
      await supabaseClient
        .from('email_logs')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
          external_id: emailResponse.data?.id
        })
        .eq('id', emailLog.id);
    }

    return new Response(JSON.stringify({
      success: true,
      email_id: emailResponse.data?.id,
      log_id: emailLog?.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error sending email:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to send email' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});