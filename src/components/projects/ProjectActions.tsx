"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DeleteModal from "@/components/shared/DeleteModal";
import { toast } from "sonner";

export default function ProjectActions({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const filesToRemove: string[] = [];

      // HERO IMAGE
      const { data: project } = await supabase
        .from("projects")
        .select("image_url")
        .eq("id", projectId)
        .single();

      if (project?.image_url) {
        const file = project.image_url.split("/").pop();
        if (file) filesToRemove.push(file);
      }

      // GALLERY
      const { data: gallery } = await supabase
        .from("project_images")
        .select("image_url")
        .eq("project_id", projectId);

      gallery?.forEach((img) => {
        if (img.image_url) {
          const file = img.image_url.split("/").pop();
          if (file) filesToRemove.push(file);
        }
      });

      // DELETE FILES
      if (filesToRemove.length > 0) {
        await supabase.storage
          .from("project-images")
          .remove(filesToRemove);
      }

      // DELETE PROJECT
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      if (error) throw error;

      toast.success("Project deleted successfully");
      window.location.href = "/dashboard/projects";

    } catch (err) {
      console.error(err);
      toast.error("Failed to delete project");
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-3 transition-colors duration-300">
      <Link
        href={`/dashboard/projects/${projectId}/edit`}
        className="px-5 py-2.5 border border-gray-300 dark:border-white/10 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-sm active:scale-95 cursor-pointer"
      >
        Edit
      </Link>

      <button
        onClick={() => setOpen(true)}
        className="bg-red-500 dark:bg-red-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-red-600 dark:hover:bg-red-500 transition-all shadow-md active:scale-95 cursor-pointer"
      >
        Delete
      </button>

      <DeleteModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}