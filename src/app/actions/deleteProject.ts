"use server";

import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/env";

export async function deleteProject(projectId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const supabaseAdmin = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const filesToRemove = new Set<string>();

    // HERO IMAGE
    const { data: project } = await supabaseAdmin
      .from("projects")
      .select("image_url")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single();

    if (!project) throw new Error("Project not found");

    if (project.image_url) {
      const file = project.image_url.split("/").pop();
      if (file) filesToRemove.add(file);
    }

    // GALLERY
    const { data: gallery } = await supabaseAdmin
      .from("project_images")
      .select("image_url")
      .eq("project_id", projectId);

    gallery?.forEach((img) => {
      const file = img.image_url.split("/").pop();
      if (file) filesToRemove.add(file);
    });

    // DELETE STORAGE
    if (filesToRemove.size > 0) {
      await supabaseAdmin.storage
        .from("project-images")
        .remove(Array.from(filesToRemove));
    }

    // DELETE PROJECT
    const { error } = await supabaseAdmin
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (error) throw error;

    return { success: true };

  } catch (err) {
    console.error(err);
    throw new Error("Failed to delete project");
  }
}
