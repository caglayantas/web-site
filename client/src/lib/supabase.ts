import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zroktbqjiyutdikwxbzk.supabase.co";
const supabaseKey = "sb_publishable_7gwgIzWZ3n1w04RRCM7q9g_P-oFGkSO";

export const supabase = createClient(supabaseUrl, supabaseKey);
