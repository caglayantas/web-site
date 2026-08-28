import { createClient } from "@supabase/supabase-js";

// This is the public Supabase client configuration.
// The publishable/anon key is safe to use in the browser when RLS protects the table.
const supabaseUrl = "https://zroktbqjiyutdikwxbzk.supabase.co";
const supabasePublishableKey = "sb_publishable_7gwgIzWZ3n1w04RRCM7q9g_P-oFGkSO";

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
