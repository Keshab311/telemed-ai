
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://ojozehxlhzkigjkigloo.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qb3plaHhsaHpraWdqa2lnbG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE4ODE4MzgsImV4cCI6MjAyNzQ1NzgzOH0.D-2QZ9NfS2MLUiC1NxZQTYvyXZO6ZTCANvcpNHOlIOs"
export const supabase = createClient(supabaseUrl, supabaseKey)