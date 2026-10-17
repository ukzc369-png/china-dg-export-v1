import { createClient } from "@supabase/supabase-js";

// Keep the public site renderable when a direct Pages deployment does not
// inject the optional CMS environment variables. Admin/API features still
// require the real values in the deployment environment.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "http://localhost:54321";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "public-site-fallback-key";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
