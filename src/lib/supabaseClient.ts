import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://vdtfxarnrdmvacatyujy.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkdGZ4YXJucmRtdmFjYXR5dWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNTQ1NjMsImV4cCI6MjA5NDczMDU2M30.rci5qUlFocPgSHLMb4GGRKz2G9r3A8q7z7sAm3nv3uw";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
