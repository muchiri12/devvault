"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ImageUploader from "@/components/shared/ImageUploader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { projectService } from "@/services/projectService";

export default function NewProjectPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [duration, setDuration] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [problem, setProblem] = useState("");
  const [process, setProcess] = useState("");
  const [solution, setSolution] = useState("");
  const [outcome, setOutcome] = useState("");
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

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

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

      const projectData = await projectService.createProject(supabase, {
        title,
        short_description: description,
        role,
        industry,
        duration,
        image_url: heroImageUrl,
        user_id: user.id,
        problem,
        process,
        solution,
        outcome,
        live_demo: liveDemo,
        github_repo: githubRepo,
      });

      if (images.length > 0) {
        const compressionOptions = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1200,
          useWebWorker: true,
          fileType: "image/webp" as const,
        };
        const uploadedUrls: string[] = [];

        for (const file of images) {
          const compressed = await imageCompression(file, compressionOptions);
          const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.webp`;

          const { error: uploadError } = await supabase.storage
            .from("project-images")
            .upload(fileName, compressed);

          if (uploadError) continue;

          const { data: urlData } = supabase.storage
            .from("project-images")
            .getPublicUrl(fileName);

          uploadedUrls.push(urlData.publicUrl);
        }

        if (uploadedUrls.length > 0) {
          await projectService.addProjectImages(supabase, projectData.id, uploadedUrls);
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
    <div className="max-w-4xl mx-auto w-full pb-20 font-sans">
      
      <header className="mb-12 mt-4 space-y-3">
        <Button variant="ghost" size="sm" href="/dashboard/projects" className="!p-2 -ml-2 mb-4 group">
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          <span className="ml-2 uppercase tracking-widest text-[10px] font-extrabold">Back to Projects</span>
        </Button>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">Add New Project</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">Create a new showcase for your professional work.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* 1. BASIC DETAILS */}
        <section className="space-y-6">
          <Badge>Basic Details</Badge>
          <Card className="space-y-8">
            <Input
              label="Project Title *"
              placeholder="e.g. Next.js E-Commerce Platform"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Short Description</label>
              <textarea
                placeholder="A brief summary of the project..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-[#0A0A0A] focus:border-black dark:focus:border-white focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] resize-none min-h-[120px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input label="Role" placeholder="e.g. Lead Frontend" value={role} onChange={(e) => setRole(e.target.value)} />
              <Input label="Industry" placeholder="e.g. FinTech" value={industry} onChange={(e) => setIndustry(e.target.value)} />
              <Input label="Duration" placeholder="e.g. 3 Months" value={duration} onChange={(e) => setDuration(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Live Demo URL" type="url" placeholder="https://your-live-site.com" value={liveDemo} onChange={(e) => setLiveDemo(e.target.value)} />
              <Input label="GitHub Repository" type="url" placeholder="https://github.com/..." value={githubRepo} onChange={(e) => setGithubRepo(e.target.value)} />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Hero Image</label>
              <ImageUploader bucket="project-images" folder="project-images" onUploadSuccess={(url) => setHeroImageUrl(url)} />
            </div>

            {/* Gallery Images Section */}
            <div className="space-y-4 pt-4 border-t border-gray-50 dark:border-white/5">
              <label className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Gallery Images</label>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById('fileUpload')?.click()}
                className="border-2 border-dashed border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 p-12 rounded-3xl text-center transition-all flex flex-col items-center justify-center cursor-pointer group"
              >
                <div className="w-16 h-16 bg-white dark:bg-white/10 rounded-2xl flex items-center justify-center mb-5 shadow-sm border border-gray-100 dark:border-white/10 group-hover:scale-105 transition-transform">
                  <svg className="w-7 h-7 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <p className="font-extrabold text-lg text-gray-900 dark:text-white">Drag & drop gallery images</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">or click to browse from computer</p>
                <input type="file" multiple accept="image/*" onChange={(e) => handleFiles(e.target.files)} className="hidden" id="fileUpload" />
              </div>

              {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
                  {previewUrls.map((url, idx) => (
                    <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10 group shadow-sm transition-all hover:shadow-xl">
                      <Image src={url} alt="Preview" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                      <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(idx); }} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px] cursor-pointer">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </section>

        {/* 2. CASE STUDY DETAILS */}
        <section className="space-y-6">
          <Badge>Case Study Details</Badge>
          <Card className="space-y-12">
            <div className="space-y-4">
              <label className="flex items-center text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1"><div className="w-2 h-2 rounded-full bg-red-500 mr-2" />The Problem</label>
              <textarea placeholder="The core issue you were trying to solve..." value={problem} onChange={(e) => setProblem(e.target.value)} className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-[#0A0A0A] focus:border-black dark:focus:border-white shadow-inner min-h-[160px] leading-relaxed" />
            </div>

            <div className="space-y-4">
              <label className="flex items-center text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1"><div className="w-2 h-2 rounded-full bg-blue-500 mr-2" />The Process</label>
              <textarea placeholder="Your strategic approach..." value={process} onChange={(e) => setProcess(e.target.value)} className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-[#0A0A0A] focus:border-black dark:focus:border-white shadow-inner min-h-[160px] leading-relaxed" />
            </div>

            <div className="space-y-4">
              <label className="flex items-center text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1"><div className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />The Solution</label>
              <textarea placeholder="What you built to solve it..." value={solution} onChange={(e) => setSolution(e.target.value)} className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-[#0A0A0A] focus:border-black dark:focus:border-white shadow-inner min-h-[160px] leading-relaxed" />
            </div>

            <div className="space-y-4">
              <label className="flex items-center text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1"><div className="w-2 h-2 rounded-full bg-indigo-500 mr-2" />The Outcome</label>
              <textarea placeholder="The quantifiable results or metrics..." value={outcome} onChange={(e) => setOutcome(e.target.value)} className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-[#0A0A0A] focus:border-black dark:focus:border-white shadow-inner min-h-[160px] leading-relaxed" />
            </div>
          </Card>
        </section>

        <div className="flex justify-end pt-8 mb-20 gap-4">
          <Button variant="secondary" href="/dashboard/projects" disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" loading={isSubmitting} disabled={isSubmitting || !title || !heroImageUrl} className="px-12">
            Publish Project
          </Button>
        </div>
      </form>
    </div>
  );
}