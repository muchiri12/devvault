"use server";

import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { createClient } from "@supabase/supabase-js";

export async function deleteUserAccount() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Not logged in");

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // 1. CLEANUP PROJECTS
    const { data: projects } = await supabaseAdmin
      .from("projects")
      .select("id, image_url")
      .eq("user_id", user.id);

    const projectFilesToRemove = new Set<string>();
    const projectIds = projects?.map((p) => p.id) || [];

    projects?.forEach((p) => {
      if (p.image_url) {
        const fileName = p.image_url.split('/').pop();
        if (fileName) projectFilesToRemove.add(fileName);
      }
    });

    if (projectIds.length > 0) {
      const { data: gallery } = await supabaseAdmin
        .from("project_images")
        .select("image_url")
        .in("project_id", projectIds);

      gallery?.forEach((g) => {
        if (g.image_url) {
          const fileName = g.image_url.split('/').pop();
          if (fileName) projectFilesToRemove.add(fileName);
        }
      });
    }

    if (projectFilesToRemove.size > 0) {
      await supabaseAdmin.storage.from("project-images").remove(Array.from(projectFilesToRemove));
    }

    // 2. CLEANUP AVATAR
    const { data: avatarFiles } = await supabaseAdmin.storage.from("avatars").list(user.id);
    if (avatarFiles && avatarFiles.length > 0) {
      const avatarPaths = avatarFiles.map((x) => `${user.id}/${x.name}`);
      await supabaseAdmin.storage.from("avatars").remove(avatarPaths);
    }

    // 3. DELETE USER
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
    if (deleteError) throw deleteError;

    // CHANGED: Just return success instead of redirecting!
    return { success: true };

  } catch (error) {
    console.error("Account deletion failed:", error);
    throw new Error("Failed to delete account");
  }
}