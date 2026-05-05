export const dynamic = "force-dynamic";

import ProjectActions from "@/components/projects/ProjectActions";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectDetails({ params }: PageProps) {
  const resolvedParams = await params;
  const projectId = resolvedParams.id;

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // FETCH PROJECT
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-[#0A0A0A] rounded-4xl border border-gray-200/50 dark:border-white/5 shadow-sm mt-8 max-w-4xl mx-auto w-full transition-colors duration-300">
        <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Project not found</h3>
        <p className="text-gray-500 dark:text-gray-400 font-medium mb-8">This project might have been deleted or is unavailable.</p>
        <Link
          href="/dashboard/projects"
          className="inline-flex items-center text-sm font-bold text-black dark:text-white uppercase tracking-wider hover:text-gray-600 dark:hover:text-gray-400 transition-colors cursor-pointer"
        >
          ← Return to Projects
        </Link>
      </div>
    );
  }

  const isOwner = user.id === project.user_id;

  // FETCH GALLERY IMAGES
  const { data: images } = await supabase
    .from("project_images")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at");

  return (
    <div className="max-w-6xl mx-auto w-full pb-20 transition-colors duration-300">

      {/* TOP NAVIGATION BAR */}
      <div className="flex items-center justify-between mb-10 mt-4">
        
        <Link
          href="/dashboard/projects"
          className="inline-flex items-center text-sm font-bold text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors group uppercase tracking-wider cursor-pointer"
        >
          <svg className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Projects
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href={`/projects/${project.id}?source=dashboard`}
            target="_blank"
            title="View Public Preview"
            className="inline-flex items-center justify-center gap-2 bg-white dark:bg-white/5 text-gray-900 dark:text-white border border-gray-200/80 dark:border-white/10 px-4 sm:px-5 py-2.5 rounded-xl font-bold shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:bg-gray-50 dark:hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300 active:scale-95 cursor-pointer text-xs"
          >
            <svg className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            <span className="hidden sm:inline">View Public Preview</span>
          </Link>
          {isOwner && (
            <ProjectActions projectId={project.id} />
          )}
        </div>

      </div>

      {/* HEADER */}
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-8 tracking-tight leading-tight">
          {project.title}
        </h1>

        {/* META DATA BAR */}
        <div className="flex flex-wrap items-center gap-6 md:gap-8 text-sm bg-white dark:bg-[#0A0A0A] p-6 md:px-10 rounded-3xl border border-gray-200/60 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8 w-fit transition-colors duration-300">
          <div className="flex flex-col">
            <span className="text-gray-400 dark:text-gray-500 uppercase tracking-widest text-[10px] font-extrabold mb-1">Role</span>
            <span className="text-gray-900 dark:text-white font-bold text-base">{project.role || "N/A"}</span>
          </div>
          <div className="w-px h-10 bg-gray-100 dark:bg-white/10 hidden sm:block"></div>
          <div className="flex flex-col">
            <span className="text-gray-400 dark:text-gray-500 uppercase tracking-widest text-[10px] font-extrabold mb-1">Industry</span>
            <span className="text-gray-900 dark:text-white font-bold text-base">{project.industry || "N/A"}</span>
          </div>
          <div className="w-px h-10 bg-gray-100 dark:bg-white/10 hidden sm:block"></div>
          <div className="flex flex-col">
            <span className="text-gray-400 dark:text-gray-500 uppercase tracking-widest text-[10px] font-extrabold mb-1">Duration</span>
            <span className="text-gray-900 dark:text-white font-bold text-base">{project.duration || "N/A"}</span>
          </div>
        </div>

        {/* ACTION LINKS (Live Demo & GitHub) */}
        {(project.live_demo || project.github_repo) && (
          <div className="flex flex-wrap gap-4">
            {project.live_demo && (
              <a
                href={project.live_demo}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-2xl text-sm font-bold hover:bg-gray-900 dark:hover:bg-gray-100 transition-all shadow-md active:scale-95 flex items-center cursor-pointer"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Live Demo
              </a>
            )}

            {project.github_repo && (
              <a
                href={project.github_repo}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 bg-white dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-gray-900 dark:text-white rounded-2xl text-sm font-bold hover:bg-gray-50 dark:hover:bg-white/10 transition-all shadow-[0_2px_10px_rgb(0,0,0,0.02)] active:scale-95 flex items-center cursor-pointer"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                View Code
              </a>
            )}
          </div>
        )}
      </header>

      {/* HERO IMAGE */}
      {project.image_url && (
        <div className="relative w-full aspect-21/9 rounded-4xl overflow-hidden mb-16 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none border border-gray-200/60 dark:border-white/5 bg-gray-50 dark:bg-white/5 transition-colors duration-300">
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            priority
            unoptimized
            sizes="(max-width:1024px) 100vw, 896px"
            className="object-cover"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* MAIN CONTENT COLUMN */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* ABOUT (SHORT DESCRIPTION) */}
          {project.short_description && (
            <div className="bg-white dark:bg-[#0A0A0A] rounded-4xl p-8 md:p-12 border border-gray-200/60 dark:border-white/5 shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-colors duration-300">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                About this project
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-loose text-lg whitespace-pre-line font-medium">
                {project.short_description}
              </p>
            </div>
          )}

          {/* CASE STUDY SECTIONS */}
          {(project.problem || project.process || project.solution || project.outcome) && (
            <div className="bg-white dark:bg-[#0A0A0A] border border-gray-200/60 dark:border-white/5 shadow-[0_4px_20px_rgb(0,0,0,0.02)] rounded-4xl p-8 md:p-12 space-y-12 transition-colors duration-300">
              
              {project.problem && (
                <section>
                  <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-4 flex items-center tracking-tight">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-3 shadow-sm"></div>
                    The Problem
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-loose text-lg whitespace-pre-line font-medium ml-5">
                    {project.problem}
                  </p>
                </section>
              )}

              {project.process && (
                <section>
                  <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-4 flex items-center tracking-tight">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-3 shadow-sm"></div>
                    The Process
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-loose text-lg whitespace-pre-line font-medium ml-5">
                    {project.process}
                  </p>
                </section>
              )}

              {project.solution && (
                <section>
                  <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-4 flex items-center tracking-tight">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-3 shadow-sm"></div>
                    The Solution
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-loose text-lg whitespace-pre-line font-medium ml-5">
                    {project.solution}
                  </p>
                </section>
              )}

              {project.outcome && (
                <section>
                  <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-4 flex items-center tracking-tight">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mr-3 shadow-sm"></div>
                    The Outcome
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-loose text-lg whitespace-pre-line font-medium ml-5">
                    {project.outcome}
                  </p>
                </section>
              )}

            </div>
          )}

        </div>

        {/* SIDEBAR COLUMN (GALLERY) */}
        <div className="lg:col-span-4">
          {images && images.length > 0 && (
            <div className="bg-white dark:bg-[#0A0A0A] rounded-4xl p-6 md:p-8 border border-gray-200/60 dark:border-white/5 shadow-[0_4px_20px_rgb(0,0,0,0.02)] sticky top-10 transition-colors duration-300">
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">Gallery</h2>
              <div className="flex flex-col gap-4">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="group relative aspect-video rounded-3xl overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm bg-gray-50 dark:bg-white/5"
                  >
                    <Image
                      src={img.image_url}
                      alt="Project gallery image"
                      fill
                      unoptimized
                      sizes="(max-width:768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}