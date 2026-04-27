import { createClient } from '@supabase/supabase-js'

// Supabase configuration using environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate that environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables:')
  console.error('   VITE_SUPABASE_URL:', supabaseUrl ? '✓ set' : '✗ missing')
  console.error('   VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ set' : '✗ missing')
  console.error('   Please add these to your .env file or hosting platform environment variables.')
}

// Create and export the Supabase client
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey)
}

export default supabase
