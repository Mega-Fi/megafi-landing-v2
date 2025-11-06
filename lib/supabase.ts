import { createClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Server-side client (for API routes)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client-side auth client (for use in components with auth)
export const createSupabaseClient = () =>
  createBrowserClient(supabaseUrl, supabaseAnonKey);
