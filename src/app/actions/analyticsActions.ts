"use server";

import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { headers } from "next/headers";

// ← 15-minute session cooldown
const VIEW_COOLDOWN_MINUTES = 15; 

export async function logProfileView(profileId: string, logIdentity: boolean = false) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Double-Check Identity: No self-counting for creators
  if (user?.id === profileId) {
    return;
  }

  // 2. Extract Client Identity (Safe Mode)
  const headerList = await headers();
  const rawIp = headerList.get("x-forwarded-for") || "";
  const ipAddress = rawIp.split(',')[0].trim() || "unknown";

  // 3. Cooldown Check: Search for only the LATEST session from the history
  const query = supabase
    .from("profile_views")
    .select("created_at")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false })
    .limit(1);

  // Identity logic for cooldowns
  const effectiveViewerId = (user && logIdentity) ? user.id : null;

  if (effectiveViewerId) {
    query.or(`viewer_id.eq.${effectiveViewerId},viewer_ip.eq.${ipAddress}`);
  } else {
    query.eq("viewer_ip", ipAddress).is("viewer_id", null);
  }

  const { data: latestSession } = await query.maybeSingle();

  const now = new Date();
  let shouldIncrementViews = true;

  if (latestSession) {
    // Check if the latest session is still "warm" (active cooldown)
    const lastSessionTime = new Date(latestSession.created_at).getTime();
    const minutesElapsed = (now.getTime() - lastSessionTime) / (1000 * 60);

    if (minutesElapsed < VIEW_COOLDOWN_MINUTES) {
      shouldIncrementViews = false;
    }
  }

  // 4. Record New Session & Increment Odometer
  if (shouldIncrementViews) {
    // Add the new record to the history log
    const { error: insertError } = await supabase.from("profile_views").insert({
      profile_id: profileId,
      viewer_ip: ipAddress,
      viewer_id: effectiveViewerId,
      created_at: now.toISOString()
    });
    
    if (insertError && insertError.code !== "23505") {
      shouldIncrementViews = false;
    }
  }

  // Finally, call the odometer incrementer (the RPC)
  if (shouldIncrementViews) {
    await supabase.rpc('increment_total_views', { profile_id: profileId });
  }
}