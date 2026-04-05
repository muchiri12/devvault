import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Service to handle all User Profile-related database operations.
 * Separating logic from UI components to make the code production-grade.
 */
export const profileService = {
  /**
   * Get a public profile by username.
   */
  async getByUsername(supabase: SupabaseClient, username: string) {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", username)
      .single();

    if (error) throw error;
    return profile;
  },

  /**
   * Get a private profile by User ID (id).
   */
  async getById(supabase: SupabaseClient, userId: string) {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return profile;
  },

  /**
   * Check if a profile has admin privileges.
   */
  async isAdmin(supabase: SupabaseClient, userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (error) return false;
    return data?.role === "admin";
  }
};
