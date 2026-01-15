import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('CRITICAL ERROR: Supabase keys are missing! Check your Render Environment Variables.');
    alert('System Error: Database connection details are missing. Please contact the administrator.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
