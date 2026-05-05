"use server";

import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/env";

import { profileService } from "@/services/profileService";

export async function deleteUserAccount() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Not logged in");

  // Create an admin client to perform the deletion
  const supabaseAdmin = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    await profileService.deleteSelf(supabaseAdmin, user.id);
    return { success: true };
  } catch (error) {
    console.error("Account deletion failed:", error);
    throw new Error("Failed to delete account");
  }
}