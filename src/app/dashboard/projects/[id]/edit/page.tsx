"use client";

import { useEffect, useState } from "react";
import imageCompression from "browser-image-compression";
import { supabase } from "@/lib/supabaseClient";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ImageUploader from "@/components/ImageUploader";

interface ProjectImage {
  id: string; 
  project_id: string;
  image_url: string;
  created_at?: string;
}

export default function EditProjectPage() {
  const { id } = useParams();
  const router = useRouter();

  // FORM STATE
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [duration, setDuration] = useState("");

  const [liveDemo, setLiveDemo] = useState("");
  const [githubRepo, setGithubRepo] = useState("");

  const [problem, setProblem] = useState("");
  const [process, setProcess] = useState("");
  const [solution, setSolution] = useState("");
  const [outcome, setOutcome] = useState("");

  // IMAGES
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [heroImageUrl, setHeroImageUrl] = useState(""); // Set by ImageUploader on selection
  const [existingHeroUrl, setExistingHeroUrl] = useState(""); // Current saved hero
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<ProjectImage[]>([]);

  // UI STATE
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // FETCH DATA
  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true);
      const { data: project } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (project) {
        setTitle(project.title || "");
        setDescription(project.short_description || "");
        setRole(project.role || "");
        setIndustry(project.industry || "");
        setDuration(project.duration || "");
        setProblem(project.problem || "");
        setProcess(project.process || "");
        setSolution(project.solution || "");
        setOutcome(project.outcome || "");
        setExistingHeroUrl(project.image_url || "");
        setLiveDemo(project.live_demo || "");
        setGithubRepo(project.github_repo || "");
      }

      const { data: images } = await supabase
        .from("project_images")
        .select("*")
        .eq("project_id", id);

      setExistingImages(images || []);
      setIsLoading(false);
    };

    fetchProject();
  }, [id]);

  // DELETE EXISTING IMAGE
  const deleteImage = async (imageId: string) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    await supabase.from("project_images").delete().eq("id", imageId);
  };

  // HANDLE UPDATE
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Use the new uploaded URL if available, otherwise keep existing
    const imageUrl = heroImageUrl || null;

    const { error: updateError } = await supabase
      .from("projects")
      .update({
        title,
        short_description: description,
        role,
        industry,
        duration,
        problem,
        process,
        solution,
        outcome,
        live_demo: liveDemo,
        github_repo: githubRepo,
        ...(imageUrl && { image_url: imageUrl })
      })
      .eq("id", id);

    if (updateError) {
      console.error("UPDATE ERROR:", updateError);
      alert("Failed to update project");
      setIsSubmitting(false);
      return;
    }

    const compressionOptions = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
      fileType: "image/webp" as const,
    };
    for (const file of galleryImages) {
      const compressed = await imageCompression(file, compressionOptions);
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.webp`;

      const { error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(fileName, compressed);

      if (uploadError) {
        console.error("UPLOAD ERROR:", uploadError);
        continue;
      }

      const { data } = supabase.storage
        .from("project-images")
        .getPublicUrl(fileName);

      await supabase.from("project_images").insert({
        project_id: id,
        image_url: data.publicUrl
      });
    }

    router.push(`/dashboard/projects/${id}`);
  };

  if (isLoading) {
    return (
    <div className="flex flex-col items-center justify-center py-32 max-w-4xl mx-auto w-full transition-colors duration-300">
        <div className="w-10 h-10 border-4 border-gray-200 dark:border-white/10 border-t-black dark:border-t-white rounded-full animate-spin mb-6 shadow-sm"></div>
        <p className="text-gray-500 dark:text-gray-400 font-bold tracking-wider uppercase text-sm">Loading project...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full pb-20 transition-colors duration-300">
      
      <Link
        href={`/dashboard/projects/${id}`}
        className="inline-flex items-center text-sm font-bold text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors mb-10 group mt-4 uppercase tracking-wider cursor-pointer"
      >
        <svg className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Project Details
      </Link>

      <header className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Edit Project
        </h1>
        <p className="text-base text-gray-500 dark:text-gray-400 mt-2 font-medium">Update the details and assets for your showcase.</p>
      </header>

      <form onSubmit={handleUpdate} className="space-y-10">
        
        {/* CARD 1: BASIC INFO */}
        <section className="bg-white dark:bg-[#0A0A0A] border border-gray-200/60 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-4xl p-8 sm:p-12 transition-colors duration-300">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-8 border-b border-gray-100/80 dark:border-white/5 pb-6 tracking-tight">Basic Details</h2>
          
          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1">Project Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-[#0A0A0A] focus:border-black dark:focus:border-white focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1">Short Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-[#0A0A0A] focus:border-black dark:focus:border-white focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1">Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-[#0A0A0A] focus:border-black dark:focus:border-white focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1">Industry</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-[#0A0A0A] focus:border-black dark:focus:border-white focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1">Duration</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-[#0A0A0A] focus:border-black dark:focus:border-white focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
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

            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1">Update Hero Image</label>
              <ImageUploader
                bucket="project-images"
                folder="project-images"
                currentImage={existingHeroUrl}
                onUploadSuccess={(url) => setHeroImageUrl(url)}
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 ml-1 mt-2 font-medium">Upload a new image to replace the current one. Auto-compresses to WebP.</p>
            </div>
          </div>
        </section>

        {/* CARD 2: CASE STUDY */}
        <section className="bg-white dark:bg-[#0A0A0A] border border-gray-200/60 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-4xl p-8 sm:p-12 transition-colors duration-300">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-8 border-b border-gray-100/80 dark:border-white/5 pb-6 tracking-tight">Case Study Details</h2>
          
          <div className="space-y-8">
            <div className="space-y-2">
              <label className="flex items-center text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-2 shadow-sm"></div>
                The Problem
              </label>
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-[#0A0A0A] focus:border-black dark:focus:border-white focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] resize-none"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2 shadow-sm"></div>
                The Process
              </label>
              <textarea
                value={process}
                onChange={(e) => setProcess(e.target.value)}
                className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-[#0A0A0A] focus:border-black dark:focus:border-white focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] resize-none"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2 shadow-sm"></div>
                The Solution
              </label>
              <textarea
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-[#0A0A0A] focus:border-black dark:focus:border-white focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] resize-none"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1">
                <div className="w-2 h-2 rounded-full bg-purple-500 mr-2 shadow-sm"></div>
                The Outcome
              </label>
              <textarea
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-[#0A0A0A] focus:border-black dark:focus:border-white focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] resize-none"
                rows={4}
              />
            </div>
          </div>
        </section>

        {/* CARD 3: GALLERY MANAGEMENT */}
        <section className="bg-white dark:bg-[#0A0A0A] border border-gray-200/60 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-4xl p-8 sm:p-12 transition-colors duration-300">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-8 border-b border-gray-100/80 dark:border-white/5 pb-6 tracking-tight">Manage Gallery</h2>
          
          {existingImages.length > 0 && (
            <div className="mb-10">
              <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1 mb-4 block">Current Gallery Images</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {existingImages.map((img) => (
                  <div key={img.id} className="relative aspect-video group rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5 shadow-[0_2px_8px_rgb(0,0,0,0.04)] bg-gray-50 dark:bg-white/5">
                    <Image 
                      src={img.image_url} 
                      alt="Gallery Image" 
                      fill 
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-black/40 dark:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                      <button
                        type="button"
                        onClick={() => deleteImage(img.id)}
                        className="bg-white dark:bg-black text-gray-900 dark:text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 active:scale-95 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1">Upload Additional Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setGalleryImages(Array.from(e.target.files || []))}
               className="w-full text-gray-900 dark:text-white text-sm bg-gray-50/50 dark:bg-white/5 file:mr-5 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-white dark:file:bg-white/10 file:text-black dark:file:text-white file:shadow-sm hover:file:bg-gray-100 dark:hover:file:bg-white/20 transition-all cursor-pointer border border-gray-200/80 dark:border-white/10 rounded-2xl p-2 outline-none"
            />
          </div>
        </section>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end pt-4 mb-20">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-12 py-4 rounded-2xl font-bold text-white dark:text-black transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
              isSubmitting 
                ? "bg-gray-400 dark:bg-gray-800 cursor-not-allowed shadow-none" 
                : "bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 shadow-black/10 dark:shadow-white/5"
            }`}
          >
            {isSubmitting ? "Saving Changes..." : "Update Project"}
            {!isSubmitting && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}