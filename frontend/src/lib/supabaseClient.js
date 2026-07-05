import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Helps catch a missing .env file early instead of a cryptic fetch error later.
  console.warn(
    'Missing Supabase env vars. Copy .env.example to .env and fill in your project URL/anon key.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
