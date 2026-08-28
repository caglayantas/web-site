import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || "https://zroktbqjiyutdikwxbzk.supabase.co").trim();
const configuredKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();

// The publishable key is safe for browser use. Keep a known-good project key as a
// fallback so a missing/misconfigured Vercel environment variable cannot break
// the public contact form.
const supabasePublishableKey = configuredKey.startsWith("sb_publishable_")
  ? configuredKey
  : "sb_publishable_7gwgIzWZ3n1w04RRCM7q9g_P-oFGkSO";

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
