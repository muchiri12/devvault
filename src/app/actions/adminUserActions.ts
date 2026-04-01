"use server";

import { createAdminClient } from "@/lib/supabaseAdmin";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { headers } from "next/headers";

// ── Helpers ────────────────────────────────────────────────────────────────

function parseBrowser(ua: string): string {
  if (ua.includes("Edg/")) {
    const v = ua.match(/Edg\//)?.[0] ? ua.split("Edg/")[1].split(".")[0] : "";
    return `Edge ${v}`.trim();
  }
  if (ua.includes("OPR/") || ua.includes("Opera")) {
    const v = ua.split("OPR/")[1]?.split(".")[0] || "";
    return `Opera ${v}`.trim();
  }
  if (ua.includes("Chrome/")) {
    const v = ua.split("Chrome/")[1]?.split(".")[0] || "";
    return `Chrome ${v}`.trim();
  }
  if (ua.includes("Firefox/")) {
    const v = ua.split("Firefox/")[1]?.split(".")[0] || "";
    return `Firefox ${v}`.trim();
  }
  if (ua.includes("Safari/") && ua.includes("Version/")) {
    const v = ua.split("Version/")[1]?.split(".")[0] || "";
    return `Safari ${v}`.trim();
  }
  return ua.split(" ")[0] || "Unknown Browser";
}

function formatIp(raw: string): string {
  const ip = raw.split(",")[0].trim();
  if (!ip || ip === "::1" || ip === "127.0.0.1") return "Localhost";
  return ip;
}

// verifies caller is a signed-in admin

async function requireAdmin() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  if (!currentUser) return { error: "Unauthorized" as const };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", currentUser.id)
    .single();

  if (profile?.role !== "admin") return { error: "Forbidden" as const };

  return { currentUser };
}

// change user role 

export async function updateUserRole(userId: string, role: "user" | "admin") {
  // 1. Verify caller is admin
  const guard = await requireAdmin();
  if ("error" in guard) return { error: guard.error };

  const supabaseAdmin = createAdminClient();

  // 2.  demoting, ensure this isn't the last admin.
  if (role === "user") {
    const { count } = await supabaseAdmin
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");

    if (count === 1) {
      return { error: "Cannot demote the last admin — promote another user first." };
    }
  }

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ role })
    .eq("id", userId);

  if (error) return { error: error.message };
  const { currentUser } = guard;

  // 3. Grab network headers for audit metadata
  const headerList = await headers();
  const ipAddress = formatIp(headerList.get("x-forwarded-for") || "");
  const browser = parseBrowser(headerList.get("user-agent") || "");

  // 4. write to audit log
  await supabaseAdmin.from("audit_logs").insert({
    user_id: currentUser.id,
    action: "user.role.updated",
    target_id: userId,
    metadata: { new_role: role, ip_address: ipAddress, browser },
  });

  return { success: true };
}


// DELETE USER (ADMIN VERSION)

export async function adminDeleteUser(userId: string) {
  // 1. Verify caller is admin
  const guard = await requireAdmin();
  if ("error" in guard) return { error: guard.error };

  const { currentUser } = guard;

  // 2. Prevent self-deletion
  if (currentUser.id === userId) {
    return { error: "You cannot delete your own account." };
  }

  const supabaseAdmin = createAdminClient();

  // 3. Prevent deleting the last admin
  const targetProfile = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (targetProfile.data?.role === "admin") {
    const { count } = await supabaseAdmin
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");

    if (count === 1) {
      return { error: "Cannot delete the last admin — promote another user first." };
    }
  }

  try {
    // 4. Grab network headers for audit metadata
    const headerList = await headers();
    const ipAddress = formatIp(headerList.get("x-forwarded-for") || "");
    const browser = parseBrowser(headerList.get("user-agent") || "");

    // 5. WRITE TO AUDIT LOG FIRST
    await supabaseAdmin.from("audit_logs").insert({
      user_id: currentUser.id,
      action: "user.deleted",
      target_id: userId,
      metadata: {
        deleted_at: new Date().toISOString(),
        ip_address: ipAddress,
        browser,
      },
    });

    // 5. Fetch user's projects
    const { data: projects } = await supabaseAdmin
      .from("projects")
      .select("id, image_url")
      .eq("user_id", userId);

    const projectFilesToRemove = new Set<string>();
    const projectIds = projects?.map((p) => p.id) || [];

    // 5. Collect project hero images
    projects?.forEach((p) => {
      if (p.image_url) {
        const fileName = p.image_url.split("/").pop();
        if (fileName) projectFilesToRemove.add(fileName);
      }
    });

    // 6. Collect gallery images
    if (projectIds.length > 0) {
      const { data: gallery } = await supabaseAdmin
        .from("project_images")
        .select("image_url")
        .in("project_id", projectIds);

      gallery?.forEach((g) => {
        if (g.image_url) {
          const fileName = g.image_url.split("/").pop();
          if (fileName) projectFilesToRemove.add(fileName);
        }
      });
    }

    // 7. Delete project images from storage
    if (projectFilesToRemove.size > 0) {
      await supabaseAdmin.storage
        .from("project-images")
        .remove(Array.from(projectFilesToRemove));
    }

    // 8. Delete avatar folder
    const { data: avatarFiles } = await supabaseAdmin.storage
      .from("avatars")
      .list(userId);

    if (avatarFiles && avatarFiles.length > 0) {
      const avatarPaths = avatarFiles.map((x) => `${userId}/${x.name}`);
      await supabaseAdmin.storage.from("avatars").remove(avatarPaths);
    }

    // 9. Delete the user from auth (cascades profile + projects via FK)
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) return { error: error.message };

    return { success: true };
  } catch (error) {
    console.error("Admin user deletion failed:", error);
    return { error: "Failed to delete user" };
  }
}
