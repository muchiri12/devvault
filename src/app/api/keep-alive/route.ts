import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

/**
 * Supabase Free Tier Keep-Alive Endpoint
 * 
 * Supabase pauses free-tier databases after 7 days of inactivity.
 * This route is hit automatically by a Vercel Cron Job every 2 days
 * to keep the database active and prevent pausing.
 */
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    // A lightweight query that touches the database without fetching real data
    const { error } = await supabase
      .from("profiles")
      .select("id")
      .limit(1);

    if (error) {
      console.error("Keep-alive ping failed:", error.message);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      message: "Supabase database is alive.",
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Unexpected failure" },
      { status: 500 }
    );
  }
}
