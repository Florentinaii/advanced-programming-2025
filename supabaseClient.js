import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xxxxx.supabase.co'
const supabaseKey = 'your-anon-key' // Gjej në Supabase dashboard

export const supabase = createClient(supabaseUrl, supabaseKey)