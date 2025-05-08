import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wntmrjeztupoazzfhapb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndudG1yamV6dHVwb2F6emZoYXBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2ODE5MjAsImV4cCI6MjA2MjI1NzkyMH0.lxVz4FBdeaDUpW8Tif_XrMr8K0YAF4h49kieWJ-HNBA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
