"use server";

import { createServerSupabaseClient } from "@/lib/supabaseServer";

import { projectService } from "@/services/projectService";

export async function updateProjectOrder(projects: { id: string; sort_order: number }[]) {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  try {
    await projectService.updateOrder(supabase, user.id, projects);
    return { success: true };
  } catch (error) {
    console.error("Failed to update project order:", error);
    return { success: false, error: "Failed to update order" };
  }
}

import { z } from "zod";

const projectSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  industry: z.string().max(50, "Industry must be under 50 characters").optional().default(""),
  short_description: z.string().max(500, "Description is too long").optional().default(""),
  live_demo: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  github_repo: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export async function saveProject(rawFormData: {
  id?: string;
  title: string;
  industry: string;
  short_description: string;
  live_demo?: string;   
  github_repo?: string; 
  image_url: string;
}) {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const validationResult = projectSchema.safeParse(rawFormData);
  if (!validationResult.success) {
    return { success: false, error: "Invalid data format submitted." };
  }

  try {
    await projectService.saveProject(supabase, user.id, validationResult.data);
    return { success: true };
  } catch (error) {
    console.error("Failed to save project:", error);
    return { success: false, error: "Failed to save project" };
  }
}
