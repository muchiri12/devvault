"use server";

import { createServerSupabaseClient } from "@/lib/supabaseServer";

export async function updateProjectOrder(projects: { id: string; sort_order: number }[]) {
  const supabase = await createServerSupabaseClient();

  // 1. Verify Authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  try {
    // use Promise.all to run these updates in parallel so it feels instant
    await Promise.all(
      projects.map((project) =>
        supabase
          .from("projects")
          .update({ sort_order: project.sort_order })
          .eq("id", project.id)
          .eq("user_id", user.id)
      )
    );

    return { success: true };
  } catch (error) {
    console.error("Failed to update project order:", error);
    return { success: false, error: "Failed to update order" };
  }
}

export async function saveProject(formData: {
  id?: string;
  title: string;
  industry: string;
  short_description: string;
  live_demo?: string;   // matches DB column name
  github_repo?: string; // matches DB column name
  image_url: string;
}) {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  try {
    if (formData.id) {
      // UPDATE EXISTING PROJECT
      await supabase
        .from("projects")
        .update({
          title: formData.title,
          industry: formData.industry,
          short_description: formData.short_description,
          live_demo: formData.live_demo,
          github_repo: formData.github_repo,
          image_url: formData.image_url,
        })
        .eq("id", formData.id)
        .eq("user_id", user.id); // Security check
    } else {
      // CREATE NEW PROJECT — place at the end of the sort order
      const { data: existingProjects } = await supabase
        .from("projects")
        .select("sort_order")
        .eq("user_id", user.id)
        .order("sort_order", { ascending: false })
        .limit(1);

      const nextSortOrder =
        existingProjects?.[0]?.sort_order !== undefined
          ? existingProjects[0].sort_order + 1
          : 0;

      await supabase.from("projects").insert({
        user_id: user.id,
        title: formData.title,
        industry: formData.industry,
        short_description: formData.short_description,
        live_demo: formData.live_demo,
        github_repo: formData.github_repo,
        image_url: formData.image_url,
        sort_order: nextSortOrder,
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to save project:", error);
    return { success: false, error: "Failed to save project" };
  }
}
