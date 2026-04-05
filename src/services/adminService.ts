import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Service to handle administrative operations.
 * USE CAUTION: These operations often require the service_role key (Admin Client).
 */
export const adminService = {
  /**
   * Get all users with their auth emails merged into the profile.
   * Requires a standard supabase client for profiles AND an admin client for auth.
   */
  async getAllUsers(supabase: SupabaseClient, supabaseAdmin: any) {
    // 1. Fetch all profiles
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id, username, role, avatar_url, created_at")
      .order("created_at", { ascending: false });

    if (profileError) throw profileError;

    // 2. Fetch auth emails via admin client
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers({ 
      perPage: 1000 
    });

    if (authError) throw authError;

    const emailMap = new Map<string, string | undefined>(
      authData?.users?.map((u: any) => [u.id, u.email as string]) ?? []
    );

    // 3. Merge
    const users = profiles?.map((p) => ({
      id: p.id as string,
      username: p.username as string,
      role: p.role as string,
      avatar_url: p.avatar_url as string,
      created_at: p.created_at as string,
      email: emailMap.get(p.id) || undefined,
    }));

    return users || [];
  },

  /**
   * Fetch audit logs with filtering and username resolution.
   */
  async getAuditLogs(supabase: SupabaseClient, filters: { 
    page?: number; 
    itemsPerPage?: number;
    action?: string;
    search?: string;
  }) {
    const { page = 1, itemsPerPage = 20, action, search } = filters;
    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    // 1. Build Base Query
    let query = supabase
      .from("audit_logs")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (action) {
      query = query.eq("action", action);
    }

    // 2. Handle Search (ILike on username requires fetching IDs first)
    if (search) {
      const { data: matchedProfiles } = await supabase
        .from("profiles")
        .select("id")
        .ilike("username", `%${search}%`);

      const matchedIds = matchedProfiles?.map((p) => p.id) || [];
      if (matchedIds.length > 0) {
        query = query.in("user_id", matchedIds);
      } else {
        query = query.eq("id", "00000000-0000-0000-0000-000000000000");
      }
    }

    const { data: logs, count, error } = await query;
    if (error) throw error;

    // 3. Resolve Usernames for the logs
    const uniqueUserIds = Array.from(
      new Set(
        (logs || [])
          .flatMap((log) => [log.user_id, log.target_id])
          .filter(Boolean)
      )
    );

    let profileMap: Record<string, string> = {};
    if (uniqueUserIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username")
        .in("id", uniqueUserIds);

      profileMap = profiles?.reduce((acc, profile) => {
        acc[profile.id] = profile.username;
        return acc;
      }, {} as Record<string, string>) || {};
    }

    return {
      logs: logs || [],
      count: count || 0,
      profileMap,
      totalPages: count ? Math.ceil(count / itemsPerPage) : 1
    };
  },

  /**
   * Fetch all resources pending approval.
   */
  async getPendingResources(supabase: SupabaseClient) {
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Update resource status (approve/reject).
   */
  async reviewResource(supabase: SupabaseClient, { id, status, adminId }: { 
    id: string; 
    status: "approved" | "rejected";
    adminId: string;
  }) {
    const { error } = await supabase
      .from("resources")
      .update({
        status: status,
        reviewed_by: adminId,
        reviewed_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) throw error;
  }
};
