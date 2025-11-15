import { createClient } from "@supabase/supabase-js";

export function createServerSupabase() {

  console.log(process.env.NEXT_PUBLIC_SUPABASE_URL , process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
