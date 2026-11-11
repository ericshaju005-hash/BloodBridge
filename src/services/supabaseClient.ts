import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Support both .env variables (VITE_ and NEXT_PUBLIC_) and UI runtime configuration via LocalStorage
export const getSupabaseConfig = () => {
  const envUrl = 
    (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
    (import.meta.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined);

  const envKey = 
    (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
    (import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string | undefined) ||
    (import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined);

  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('bloodbridge_supabase_url') : null;
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('bloodbridge_supabase_key') : null;

  const url = (localUrl || envUrl || '').trim();
  const key = (localKey || envKey || '').trim();

  const isConfigured =
    url.length > 0 &&
    key.length > 0 &&
    url.startsWith('https://') &&
    !url.includes('your-project') &&
    !key.includes('your-anon-public-key');

  return { url, key, isConfigured };
};

export const isSupabaseConfigured = (): boolean => {
  return getSupabaseConfig().isConfigured;
};

let clientInstance: SupabaseClient | null = null;
let lastUsedUrl = '';
let lastUsedKey = '';

export const getSupabase = (): SupabaseClient | null => {
  const { url, key, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  if (!clientInstance || url !== lastUsedUrl || key !== lastUsedKey) {
    clientInstance = createClient(url, key);
    lastUsedUrl = url;
    lastUsedKey = key;
  }
  return clientInstance;
};

// Test connection to Supabase donors table
export const testSupabaseConnection = async (): Promise<{ success: boolean; message: string; donorCount?: number }> => {
  const client = getSupabase();
  if (!client) {
    return {
      success: false,
      message: 'Supabase URL and API Key must be set (valid URL starting with https://).'
    };
  }

  try {
    const { data, count, error } = await client
      .from('donors')
      .select('*', { count: 'exact', head: false })
      .limit(10);

    if (error) {
      if (error.code === '42P01') {
        return {
          success: false,
          message: 'Connected to Supabase, but the "donors" table was not created yet. Please execute the SQL setup script in your Supabase SQL Editor.'
        };
      }
      return {
        success: false,
        message: `Supabase Error: ${error.message} (${error.code || 'UNKNOWN'})`
      };
    }

    return {
      success: true,
      message: `Connected successfully! Found ${count ?? data?.length ?? 0} donors in your live database.`,
      donorCount: count ?? data?.length ?? 0
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Failed to connect to Supabase.'
    };
  }
};
