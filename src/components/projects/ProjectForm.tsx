"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/shared/ImageUploader";
import { saveProject } from "@/app/actions/projectActions";

interface ProjectFormData {
  title: string;
  industry: string;
  short_description: string;
  live_demo: string;
  github_repo: string;
  image_url: string;
}

interface InitialData extends Partial<ProjectFormData> {
  id?: string;
}

export default function ProjectForm({
  initialData,
  onSuccess,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: InitialData;
  onSuccess: () => void;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<ProjectFormData>({
    title: initialData?.title || "",
    industry: initialData?.industry || "",
    short_description: initialData?.short_description || "",
    live_demo: initialData?.live_demo || "",
    github_repo: initialData?.github_repo || "",
    image_url: initialData?.image_url || "",
  });

  const set = (key: keyof ProjectFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url) {
      alert("Please upload a project image first!");
      return;
    }

    setIsSubmitting(true);

    const result = await saveProject({
      id: initialData?.id,
      ...formData,
    });

    setIsSubmitting(false);

    if (result.success) {
      router.refresh();
      onSuccess();
    } else {
      alert("Failed to save project. Please try again.");
    }
  };

  const inputClass =
    "w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-2xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-[#0A0A0A] focus:border-black dark:focus:border-white focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 text-sm";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white dark:bg-[#0A0A0A] p-6 sm:p-8 rounded-[2rem] border border-gray-200/60 dark:border-white/5 shadow-xl"
    >
      {/* HEADER */}
      <div className="pb-4 border-b border-gray-100 dark:border-white/5">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          {initialData?.id ? "Edit Project" : "Add New Project"}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
          Showcase your best work to recruiters and clients.
        </p>
      </div>

      {/* HERO IMAGE UPLOADER */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          Project Screenshot
        </label>
        <ImageUploader
          bucket="project-images"
          folder="project-images"
          currentImage={formData.image_url}
          onUploadSuccess={(url) =>
            setFormData((prev) => ({ ...prev, image_url: url }))
          }
        />
      </div>

      {/* TITLE + INDUSTRY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Project Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. StyleNest E-Commerce"
            value={formData.title}
            onChange={set("title")}
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Industry / Category *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. SaaS, Fintech, Web3"
            value={formData.industry}
            onChange={set("industry")}
            className={inputClass}
          />
        </div>
      </div>

      {/* SHORT DESCRIPTION */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          Short Description *
        </label>
        <textarea
          required
          rows={3}
          placeholder="A brief overview of what this project does and the problem it solves..."
          value={formData.short_description}
          onChange={set("short_description")}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* LIVE DEMO + GITHUB */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Live Demo URL
          </label>
          <input
            type="url"
            placeholder="https://your-site.com"
            value={formData.live_demo}
            onChange={set("live_demo")}
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            GitHub URL
          </label>
          <input
            type="url"
            placeholder="https://github.com/you/repo"
            value={formData.github_repo}
            onChange={set("github_repo")}
            className={inputClass}
          />
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onSuccess}
          className="px-6 py-3 font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-colors text-sm cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 transition-colors text-sm active:scale-95 cursor-pointer"
        >
          {isSubmitting ? "Saving…" : "Save Project"}
        </button>
      </div>
    </form>
  );
}
