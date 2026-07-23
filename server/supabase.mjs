import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://anhndnksnbqflbmwuper.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuaG5kbmtzbmJxZmxibXd1cGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0Nzk1MTcsImV4cCI6MjEwMDA1NTUxN30.GNax-iJOj4xk7OZzvGFR7Fa7NF_s8q0J6XNOUsaJjzI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
