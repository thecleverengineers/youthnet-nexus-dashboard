// Edge Function: create-admin-user
// Creates a confirmed admin user and corresponding profile row
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
  }

  try {
    const { email, password, full_name } = await req.json();
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Missing email or password' }), { status: 400 });
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Check if user already exists
    const { data: existing, error: listErr } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (listErr) throw listErr;
    const already = existing.users.find((u) => u.email?.toLowerCase() === String(email).toLowerCase());
    if (already) {
      return new Response(JSON.stringify({ ok: true, message: 'User already exists', user_id: already.id }), { status: 200 });
    }

    // Create user with confirmed email and admin role metadata
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: 'admin', full_name: full_name || 'Administrator' },
    });
    if (createErr) throw createErr;
    const user = created.user;
    if (!user) throw new Error('User creation returned no user');

    // Ensure profile row exists
    const { error: profileErr } = await admin.from('profiles').insert({
      user_id: user.id,
      full_name: full_name || 'Administrator',
      email,
      role: 'admin',
      status: 'active',
    });
    if (profileErr && !String(profileErr.message).includes('duplicate')) throw profileErr;

    return new Response(JSON.stringify({ ok: true, user_id: user.id }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e?.message || e) }), { status: 400 });
  }
});