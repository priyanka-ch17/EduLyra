import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * Supabase is optional in the demo/local build. A malformed environment value
 * must never prevent the React app from booting and showing the local workspace.
 */
let client: SupabaseClient | null = null;
if (supabaseUrl && supabaseKey) {
  try {
    client = createClient(supabaseUrl, supabaseKey);
  } catch {
    client = null;
  }
}

export const isSupabaseConfigured = Boolean(client);
export const supabase: SupabaseClient | null = client;
