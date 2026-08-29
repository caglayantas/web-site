import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || "https://zroktbqjiyutdikwxbzk.supabase.co").trim();
const configuredKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();

// Use the project's real legacy anon key as the compatibility fallback. It is a
// public browser key protected by Supabase RLS; the contact table has an INSERT
// policy for anon/authenticated users.
const supabaseAnonKey = configuredKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpyb2t0YnFqaXl1dGRpa3d4YnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MDg3NzksImV4cCI6MjEwMzQ4NDc3OX0.3dLitlDJT3WKTBBcqjtH4rJO08etXYm8wqUBQp1WOb8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
