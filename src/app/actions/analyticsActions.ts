"use server";

import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { headers } from "next/headers";

export async function logProfileView(profileId: string) {
  const supabase = await createServerSupabaseClient();

  // 1. Get the current user (if any)
  const { data: { user } } = await supabase.auth.getUser();

  // 2. self-vieW filter: If the viewer is the owner, don't count it.
  if (user?.id === profileId) {
    console.log("Analytics: Filtering out owner's own view.");
    return;
  }

  // 3. Get the viewer's IP address (fallback for guests)
  const headerList = await headers();
  const rawIp = headerList.get("x-forwarded-for") || "";
  const ipAddress = rawIp.split(',')[0].trim() || "unknown_ip";

  // 4. trck view for 15 mins
  const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();


  // Check  same viewer log exists in the last 15 minutes
  const { data: recentView } = await supabase
    .from("profile_views")
    .select("id")
    .eq("profile_id", profileId)
    .gte("created_at", fifteenMinsAgo)
    .or(user ? `viewer_id.eq.${user.id}` : `viewer_ip.eq.${ipAddress}`)
    .maybeSingle();

  if (!recentView) {
    // If no recent view, increment the total odometer on the profile
    await supabase.rpc('increment_total_views', { profile_id: profileId });
  }


  // Check if this same viewer has EVER viewed this profile
  const { data: foreverView } = await supabase
    .from("profile_views")
    .select("id")
    .eq("profile_id", profileId)
    .or(user ? `viewer_id.eq.${user.id}` : `viewer_ip.eq.${ipAddress}`)
    .maybeSingle();

  // 5. If they have NEVER viewed it before, log the new unique visitor!
  if (!foreverView) {
    await supabase.from("profile_views").insert({
      profile_id: profileId,
      viewer_ip: ipAddress,
      viewer_id: user?.id || null
    });
  }
}