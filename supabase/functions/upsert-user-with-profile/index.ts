// Edge Function: upsert-user-with-profile
// Creates or updates a Supabase Auth user (password optional) and upserts a matching profile row
// Publicly callable; uses service role key internally
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  try {
    const { email, password, full_name, phone, address, role = 'staff', status = 'active' } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: 'Missing email' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: 'Missing Supabase configuration' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Try to find existing user by email
    let userId: string | null = null;
    try {
      // listUsers can't filter directly by email; fetch first pages reasonably
      const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
      if (error) throw error;
      const found = data.users.find((u) => u.email?.toLowerCase() === String(email).toLowerCase());
      if (found) userId = found.id;
    } catch (e) {
      console.error('listUsers error', e);
    }

    // Create or update the auth user if password provided
    if (password) {
      if (userId) {
        const { error: updErr } = await admin.auth.admin.updateUserById(userId, {
          password: String(password),
          email_confirm: true,
          user_metadata: { role, full_name: full_name || email }
        });
        if (updErr) throw updErr;
      } else {
        const { data: created, error: crErr } = await admin.auth.admin.createUser({
          email,
          password: String(password),
          email_confirm: true,
          user_metadata: { role, full_name: full_name || email }
        });
        if (crErr) throw crErr;
        userId = created.user?.id ?? null;
      }
    }

    // Upsert profile row (even if no password was set)
    if (!userId) {
      // If no auth user, fabricate a stable UUID using crypto random (not ideal for real FK, but profiles table in this app is independent)
      userId = crypto.randomUUID();
    }

    const profilePayload: Record<string, any> = {
      user_id: userId,
      full_name: full_name || email,
      email,
      role,
      status,
    };
    if (phone !== undefined) profilePayload.phone = phone;
    if (address !== undefined) profilePayload.address = address;

    // Upsert using user_id conflict target
    const { error: upsertErr } = await admin.from('profiles').upsert(profilePayload, { onConflict: 'user_id' });
    if (upsertErr) throw upsertErr;

    return new Response(JSON.stringify({ ok: true, user_id: userId }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('upsert-user-with-profile error', e);
    return new Response(JSON.stringify({ error: String((e as any)?.message || e) }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
