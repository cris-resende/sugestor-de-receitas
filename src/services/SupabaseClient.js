import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zotrteveondiwrhgahiy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvdHJ0ZXZlb25kaXdyaGdhaGl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0MzQ5MTAsImV4cCI6MjA3MjAxMDkxMH0.HjlDP3Kb-kp8QKBfpkzd2XfrUxrmC99_3BCLJZrML3Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
