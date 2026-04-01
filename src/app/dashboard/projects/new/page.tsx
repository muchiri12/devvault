"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ImageUploader from "@/components/ImageUploader";

export default function NewProjectPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [heroImageUrl, setHeroImageUrl] = useState(""); // Set by ImageUploader
  const [problem, setProblem] = useState("");
  const [process, setProcess] = useState("");
  const [solution, setSolution] = useState("");
  const [outcome, setOutcome] = useState("");

  // NEW: State for URL links
  const [liveDemo, setLiveDemo] = useState("");
  const [githubRepo, setGithubRepo] = useState("");

  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    setImages((prev) => [...prev, ...fileArray]);
    const newPreviews = fileArray.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    setPreviewUrls((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsSubmitting(false);
        return;
      }

      // Hero image is already uploaded by ImageUploader — use the URL directly
      const imageUrl = heroImageUrl;

      // UPDATED: Added live_demo and github_repo to the insert array
      const { data: projectData, error } = await supabase
        .from("projects")
        .insert([
          {
            title,
            short_description: description,
            role,
            industry,
            duration,
            image_url: imageUrl,
            user_id: user.id,
            problem,
            process,
            solution,
            outcome,
            live_demo: liveDemo,
            github_repo: githubRepo,
          }
        ])
        .select()
        .single();

      if (error || !projectData) {
        console.error("Project Insert Error:", error);
        alert("Failed to create project");
        setIsSubmitting(false);
        return;
      }

      if (images.length > 0) {
        const compressionOptions = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1200,
          useWebWorker: true,
          fileType: "image/webp" as const,
        };
        for (const file of images) {
          const compressed = await imageCompression(file, compressionOptions);
          const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.webp`;

          const { error: uploadError } = await supabase.storage
            .from("project-images")
            .upload(fileName, compressed);

          if (uploadError) {
            console.error("Gallery upload error:", uploadError);
            continue;
          }

          const { data: urlData } = supabase.storage
            .from("project-images")
            .getPublicUrl(fileName);

          await supabase.from("project_images").insert([
            {
              project_id: projectData.id,
              image_url: urlData.publicUrl
            }
          ]);
        }
      }

      router.push("/dashboard/projects");

    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full pb-20 transition-colors duration-300">

      <Link
        href="/dashboard/projects"
        className="inline-flex items-center text-sm font-bold text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors mb-10 group mt-4 uppercase tracking-wider cursor-pointer"
      >
        <svg className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Projects
      </Link>

      <header className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Add New Project
        </h1>
        <p className="text-base text-gray-500 dark:text-gray-400 mt-2 font-medium">Create a new showcase for your work.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-10">

        <section className="bg-white dark:bg-[#0A0A0A] border border-gray-200/60 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-4xl p-8 sm:p-12 transition-colors duration-300">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-8 border-b border-gray-100/80 dark:border-white/5 pb-6 tracking-tight">Basic Details</h2>

          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1">Project Title *</label>
              <input
                type="text"
                placeholder="e.g. Next.js E-Commerce Platform"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-[#0A0A0A] focus:border-black dark:focus:border-white focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1">Short Description</label>
              <textarea
                placeholder="A brief summary of the project..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-[#0A0A0A] focus:border-black dark:focus:border-white focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1">Role</label>
                <input
                  type="text"
                  placeholder="e.g. Lead Frontend"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-[#0A0A0A] focus:border-black dark:focus:border-white focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1">Industry</label>
                <input
                  type="text"
                  placeholder="e.g. FinTech"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-[#0A0A0A] focus:border-black dark:focus:border-white focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1">Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 3 Months"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-[#0A0A0A] focus:border-black dark:focus:border-white focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1">Live Demo URL</label>
                <input
                  type="url"
                  placeholder="https://your-live-site.com"
                  value={liveDemo}
                  onChange={(e) => setLiveDemo(e.target.value)}
                  className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-[#0A0A0A] focus:border-black dark:focus:border-white focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1">GitHub Repository</label>
                <input
                  type="url"
                  placeholder="https://github.com/your-username/repo"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-[#0A0A0A] focus:border-black dark:focus:border-white focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1">Hero Image</label>
              <ImageUploader
                bucket="project-images"
                folder="project-images"
                onUploadSuccess={(url) => setHeroImageUrl(url)}
              />
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1 mb-2 block">Gallery Images</label>

              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-gray-200/80 dark:border-white/10 bg-gray-50/30 dark:bg-white/5 hover:bg-gray-50/80 dark:hover:bg-white/10 p-12 rounded-3xl text-center transition-all flex flex-col items-center justify-center cursor-pointer group"
                onClick={() => document.getElementById('fileUpload')?.click()}
              >
                <div className="w-16 h-16 bg-white dark:bg-white/5 rounded-2xl flex items-center justify-center mb-5 shadow-sm border border-gray-100 dark:border-white/10 group-hover:scale-105 transition-transform">
                  <svg className="w-7 h-7 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-900 dark:text-white font-extrabold text-lg tracking-tight">
                  Drag & drop images here
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1 mb-2">or click to browse from your computer</p>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFiles(e.target.files)}
                  className="hidden"
                  id="fileUpload"
                />
              </div>

              {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 mt-6">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative aspect-video rounded-2xl overflow-hidden shadow-sm group border border-gray-100 dark:border-white/5">
                      <Image
                        src={url}
                        alt="preview"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 text-black dark:text-white w-8 h-8 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:scale-105 hover:bg-white dark:hover:bg-black cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </section>

        <section className="bg-white dark:bg-[#0A0A0A] border border-gray-200/60 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-4xl p-8 sm:p-12 transition-colors duration-300">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-8 border-b border-gray-100/80 dark:border-white/5 pb-6 tracking-tight">Case Study Details</h2>

          <div className="space-y-8">
            <div className="space-y-2">
              <label className="flex items-center text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-2 shadow-sm"></div>
                The Problem
              </label>
              <textarea
                placeholder="What was the core issue you were trying to solve?"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-[#0A0A0A] focus:border-black dark:focus:border-white focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] resize-none"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2 shadow-sm"></div>
                The Process
              </label>
              <textarea
                placeholder="How did you approach the problem?"
                value={process}
                onChange={(e) => setProcess(e.target.value)}
                className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-[#0A0A0A] focus:border-black dark:focus:border-white focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] resize-none"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2 shadow-sm"></div>
                The Solution
              </label>
              <textarea
                placeholder="What did you build?"
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-[#0A0A0A] focus:border-black dark:focus:border-white focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] resize-none"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1">
                <div className="w-2 h-2 rounded-full bg-purple-500 mr-2 shadow-sm"></div>
                The Outcome
              </label>
              <textarea
                placeholder="What were the results or metrics?"
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-[#0A0A0A] focus:border-black dark:focus:border-white focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] resize-none"
                rows={4}
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-4 mb-20">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-12 py-4 rounded-2xl font-bold text-white dark:text-black transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${isSubmitting
                ? "bg-gray-400 dark:bg-gray-800 cursor-not-allowed shadow-none"
                : "bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 shadow-black/10 dark:shadow-white/5"
              }`}
          >
            {isSubmitting ? "Building Project..." : "Publish Project"}
            {!isSubmitting && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}