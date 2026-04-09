import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

/**
 * OAuth Callback Handler
 * 
 * After a user signs in with Google, Supabase redirects them here
 * with an auth code. We exchange it for a session, then send the
 * user to the dashboard (middleware will catch username-less users
 * and redirect them to /onboarding automatically).
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If something went wrong, send them back to login with an error hint
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
