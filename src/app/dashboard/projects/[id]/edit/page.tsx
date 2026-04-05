"use client";

import { useEffect, useState, useCallback } from "react";
import imageCompression from "browser-image-compression";
import { supabase } from "@/lib/supabaseClient";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import ImageUploader from "@/components/shared/ImageUploader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { projectService } from "@/services/projectService";

interface ProjectImage {
  id: string; 
  project_id: string;
  image_url: string;
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

  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [existingHeroUrl, setExistingHeroUrl] = useState("");
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<ProjectImage[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProject = useCallback(async () => {
    setIsLoading(true);
    try {
      const project = await projectService.getProjectById(supabase, id as string);
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
        setExistingImages(project.project_images || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const deleteImage = async (imageId: string) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    await projectService.deleteProjectImage(supabase, imageId);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await projectService.updateProject(supabase, id as string, {
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
        ...(heroImageUrl && { image_url: heroImageUrl })
      });

      if (galleryImages.length > 0) {
        const compressionOptions = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1200,
          useWebWorker: true,
          fileType: "image/webp" as const,
        };
        const uploadedUrls: string[] = [];

        for (const file of galleryImages) {
          const compressed = await imageCompression(file, compressionOptions);
          const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.webp`;

          const { error: uploadError } = await supabase.storage
            .from("project-images")
            .upload(fileName, compressed);

          if (uploadError) continue;

          const { data } = supabase.storage
            .from("project-images")
            .getPublicUrl(fileName);

          uploadedUrls.push(data.publicUrl);
        }

        if (uploadedUrls.length > 0) {
          await projectService.addProjectImages(supabase, id as string, uploadedUrls);
        }
      }

      router.push(`/dashboard/projects/${id}`);
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 max-w-4xl mx-auto w-full font-sans">
        <div className="w-10 h-10 border-4 border-gray-100 dark:border-white/10 border-t-black dark:border-t-white rounded-full animate-spin mb-6"></div>
        <p className="text-gray-400 dark:text-gray-500 font-extrabold tracking-widest uppercase text-xs">Synchronizing Project...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full pb-20 font-sans">
      
      <header className="mb-12 mt-4 space-y-3">
        <Button variant="ghost" size="sm" href={`/dashboard/projects/${id}`} className="!p-2 -ml-2 mb-4 group">
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          <span className="ml-2 uppercase tracking-widest text-[10px] font-extrabold">Back to Details</span>
        </Button>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">Edit Project</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">Refine the details and assets for your developer showcase.</p>
      </header>

      <form onSubmit={handleUpdate} className="space-y-12">
        
        {/* 1. BASIC DETAILS */}
        <section className="space-y-6">
          <Badge>Basic Details</Badge>
          <Card className="space-y-8">
            <Input
              label="Project Title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <div className="space-y-3">
              <label className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Short Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-[#0A0A0A] focus:border-black dark:focus:border-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] resize-none min-h-[120px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input label="Role" value={role} onChange={(e) => setRole(e.target.value)} />
              <Input label="Industry" value={industry} onChange={(e) => setIndustry(e.target.value)} />
              <Input label="Duration" value={duration} onChange={(e) => setDuration(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Live Demo URL" type="url" placeholder="https://..." value={liveDemo} onChange={(e) => setLiveDemo(e.target.value)} />
              <Input label="GitHub Repository" type="url" placeholder="https://github.com/..." value={githubRepo} onChange={(e) => setGithubRepo(e.target.value)} />
            </div>

            <div className="space-y-4 pt-2">
              <label className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Hero Image</label>
              <ImageUploader bucket="project-images" folder="project-images" currentImage={existingHeroUrl} onUploadSuccess={(url) => setHeroImageUrl(url)} />
              <p className="text-xs text-gray-400 dark:text-gray-500 font-medium italic">Upload a new image to replace the current one. WebP optimization active.</p>
            </div>
          </Card>
        </section>

        {/* 2. GALLERY MANAGEMENT */}
        <section className="space-y-6">
          <Badge>Gallery Management</Badge>
          <Card className="space-y-10">
            {existingImages.length > 0 && (
              <div className="space-y-4">
                <label className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Current Gallery</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {existingImages.map((img) => (
                    <div key={img.id} className="relative aspect-video group rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10 transition-all hover:shadow-2xl">
                      <Image src={img.image_url} alt="Gallery" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                        <Button variant="danger" size="sm" onClick={() => deleteImage(img.id)} icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4 pt-6 border-t border-gray-50 dark:border-white/5">
              <label className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Append New Images</label>
              <Input type="file" multiple accept="image/*" onChange={(e) => setGalleryImages(Array.from(e.target.files || []))} className="cursor-pointer file:font-extrabold file:rounded-xl file:border-0 file:bg-gray-100 dark:file:bg-white/10 file:mr-6 file:px-4 file:py-2" />
            </div>
          </Card>
        </section>

        {/* 3. CASE STUDY DETAILS */}
        <section className="space-y-6">
          <Badge>Case Study details</Badge>
          <Card className="space-y-12">
            <div className="space-y-4">
              <label className="flex items-center text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1"><div className="w-2 h-2 rounded-full bg-red-500 mr-2" />The Problem</label>
              <textarea placeholder="The core issue..." value={problem} onChange={(e) => setProblem(e.target.value)} className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-[#0A0A0A] focus:border-black dark:focus:border-white shadow-inner min-h-[160px] leading-relaxed" />
            </div>

            <div className="space-y-4">
              <label className="flex items-center text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1"><div className="w-2 h-2 rounded-full bg-blue-500 mr-2" />The Process</label>
              <textarea placeholder="Your approach..." value={process} onChange={(e) => setProcess(e.target.value)} className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-[#0A0A0A] focus:border-black dark:focus:border-white shadow-inner min-h-[160px] leading-relaxed" />
            </div>

            <div className="space-y-4">
              <label className="flex items-center text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1"><div className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />The Solution</label>
              <textarea placeholder="What was built..." value={solution} onChange={(e) => setSolution(e.target.value)} className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-[#0A0A0A] focus:border-black dark:focus:border-white shadow-inner min-h-[160px] leading-relaxed" />
            </div>

            <div className="space-y-4">
              <label className="flex items-center text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1"><div className="w-2 h-2 rounded-full bg-indigo-500 mr-2" />The Outcome</label>
              <textarea placeholder="The quantifiable results..." value={outcome} onChange={(e) => setOutcome(e.target.value)} className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-[#0A0A0A] focus:border-black dark:focus:border-white shadow-inner min-h-[160px] leading-relaxed" />
            </div>
          </Card>
        </section>

        <div className="flex justify-end pt-8 mb-20 gap-4">
          <Button variant="secondary" href={`/dashboard/projects/${id}`} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" loading={isSubmitting} disabled={isSubmitting || !title} className="px-12">
            Update Project
          </Button>
        </div>
      </form>
    </div>
  );
}