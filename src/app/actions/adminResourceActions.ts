"use server";

import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";
import { adminService } from "@/services/adminService";

/**
 * Verify if the caller is an admin.
 */
async function verifyAdmin(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return profile?.role === "admin" ? user : null;
}

/**
 * Approve a pending resource.
 */
export async function approveResource(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const admin = await verifyAdmin(supabase);
  if (!admin) throw new Error("Permission Denied");

  const id = formData.get("id") as string;
  await adminService.reviewResource(supabase, { 
    id, 
    status: "approved", 
    adminId: admin.id 
  });

  revalidatePath("/dashboard/admin/resources");
}

/**
 * Reject a pending resource.
 */
export async function rejectResource(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const admin = await verifyAdmin(supabase);
  if (!admin) throw new Error("Permission Denied");

  const id = formData.get("id") as string;
  await adminService.reviewResource(supabase, { 
    id, 
    status: "rejected", 
    adminId: admin.id 
  });

  revalidatePath("/dashboard/admin/resources");
}
