import { createServerSupabaseClient } from "@/lib/supabaseServer";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    source?: string;
  }>;
}

export default async function PublicProjectDetails({ params, searchParams }: PageProps) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const projectId = resolvedParams.id;
  const isFromDashboard = resolvedSearchParams.source === "dashboard";

  const supabase = await createServerSupabaseClient();

  // 1. FETCH PROJECT
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (!project) {
    notFound();
  }

  // 2. FETCH THE CREATOR'S PROFILE (Avatar, Bio, Username)
  const { data: creator } = await supabase
    .from("profiles")
    .select("username, avatar_url, bio, id")
    .eq("id", project.user_id)
    .single();

  if (!creator) {
    notFound();
  }

  // 3. FETCH PROJECT COUNT FOR THE CREATOR (For the Hub Footer)
  const { count: projectCount } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("user_id", creator.id);

  // 4. FETCH THE PROJECT GALLERY
  const { data: images } = await supabase
    .from("project_images")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });

  // 5. FETCH CURRENT USER FOR OWNER CHECK
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  const isOwner = currentUser?.id === project.user_id;

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050505] text-black dark:text-white relative z-0 pb-24 transition-colors duration-300">
      
      {/* Background linear gradient */}
      <div className="absolute inset-0 z-[-1] bg-linear-to-b from-zinc-200/20 dark:from-white/5 via-transparent to-transparent pointer-events-none" />

      {/* THE CREATOR STICKY HEADER - Only show if accessed from Dashboard */}
      {isFromDashboard && (
        <div className="sticky top-0 z-50 w-full bg-white/80 dark:bg-[#050505]/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-white/5">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-200/60 dark:border-white/10">
                {creator.avatar_url ? (
                  <Image src={creator.avatar_url} alt={creator.username} width={40} height={40} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 font-bold bg-gray-50 dark:bg-white/5">
                    {creator.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-bold">Built by</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white transition-colors">@{creator.username}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link 
                href={`/u/${creator.username}`}
                className="px-5 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-md shadow-black/10 dark:shadow-white/5"
              >
                View Full Portfolio
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 mt-12 relative z-10">

        {/* back button */}
        <Link
          href={isFromDashboard ? `/dashboard/projects/${projectId}` : `/u/${creator.username}`}
          className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white transition-all mb-10 group"
        >
          <svg className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {isFromDashboard ? "Back to Manage" : "Back to Portfolio"}
        </Link>


        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Industry</span>
              <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-full border border-gray-200/60 dark:border-white/10">
                {project.industry || "Case Study"}
              </span>
            </div>
            {project.role && (
              <div className="flex items-center gap-2 border-l border-gray-200 dark:border-white/10 pl-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Role</span>
                <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200 rounded-full border border-zinc-200/60 dark:border-zinc-700/50">
                  {project.role}
                </span>
              </div>
            )}
            {project.duration && (
              <div className="flex items-center gap-2 border-l border-gray-200 dark:border-white/10 pl-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Duration</span>
                <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200 rounded-full border border-zinc-200/60 dark:border-zinc-700/50">
                  {project.duration}
                </span>
              </div>
            )}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tighter mb-8 sm:leading-tight">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4">
            {project.live_demo && (
              <a 
                href={project.live_demo} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-2xl transition-all shadow-xl shadow-black/10 dark:shadow-white/5 hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                Live Demo
              </a>
            )}
          </div>
        </header>

        {/* hero image */}
        {project.image_url && (
          <div className="relative w-full aspect-video rounded-[3rem] overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 shadow-2xl shadow-black/5 dark:shadow-black/20 mb-16">
            <Image
              src={project.image_url}
              alt={project.title}
              fill
              priority
              sizes="(max-width:1024px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        )}

        {/* short description / overview */}
        {project.short_description && (
          <div className="bg-white/60 dark:bg-black/40 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-14 border border-gray-200/60 dark:border-white/5 shadow-sm mb-16 transition-all">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
              Overview
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg whitespace-pre-wrap font-medium">
              {project.short_description}
            </p>
          </div>
        )}

        {/* Case study grid / flow */}
        <div className="space-y-12 lg:space-y-16 mb-24">
          {project.problem && (
            <section className="bg-white/60 dark:bg-black/40 backdrop-blur-3xl border border-gray-200/60 dark:border-white/5 shadow-sm rounded-[3rem] p-8 md:p-14 transition-all relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-2 h-full bg-rose-500 group-hover:w-3 transition-all duration-500"></div>
              <h2 className="text-2xl font-black text-rose-500 mb-6 flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center text-sm">P</div>
                The Problem
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg whitespace-pre-wrap font-medium pl-2">
                {project.problem}
              </p>
            </section>
          )}

          {project.process && (
            <section className="bg-white/60 dark:bg-black/40 backdrop-blur-3xl border border-gray-200/60 dark:border-white/5 shadow-sm rounded-[3rem] p-8 md:p-14 transition-all relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-2 h-full bg-blue-500 group-hover:w-3 transition-all duration-500"></div>
              <h2 className="text-2xl font-black text-blue-500 mb-6 flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-sm">W</div>
                The Process
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg whitespace-pre-wrap font-medium pl-2">
                {project.process}
              </p>
            </section>
          )}

          {project.solution && (
            <section className="bg-white/60 dark:bg-black/40 backdrop-blur-3xl border border-gray-200/60 dark:border-white/5 shadow-sm rounded-[3rem] p-8 md:p-14 transition-all relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500 group-hover:w-3 transition-all duration-500"></div>
              <h2 className="text-2xl font-black text-emerald-500 mb-6 flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-sm">S</div>
                The Solution
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg whitespace-pre-wrap font-medium pl-2">
                {project.solution}
              </p>
            </section>
          )}

          {project.outcome && (
            <section className="bg-white/60 dark:bg-black/40 backdrop-blur-3xl border border-gray-200/60 dark:border-white/5 shadow-sm rounded-[3rem] p-8 md:p-14 transition-all relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-2 h-full bg-purple-500 group-hover:w-3 transition-all duration-500"></div>
              <h2 className="text-2xl font-black text-purple-500 mb-6 flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center text-sm">O</div>
                The Outcome
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg whitespace-pre-wrap font-medium pl-2">
                {project.outcome}
              </p>
            </section>
          )}
        </div>

        {/* gallery */}
        {images && images.length > 0 && (
          <div className="mb-24 space-y-10">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="group relative aspect-video rounded-[2.5rem] overflow-hidden border border-gray-200/60 dark:border-white/5 shadow-xl bg-gray-100 dark:bg-zinc-800 transition-all hover:scale-[1.02] duration-500"
                >
                  <Image
                    src={img.image_url}
                    alt="Project gallery image"
                    fill
                    sizes="(max-width:768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* THE "MEET THE CREATOR" HUB FOOTER - Only show if accessed from Dashboard */}
        {isFromDashboard && (
          <section className="bg-black dark:bg-white p-8 sm:p-14 rounded-[3.5rem] text-white dark:text-black shadow-2xl relative overflow-hidden group transition-colors duration-500">
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white/5 dark:bg-black/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="relative shrink-0">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white/10 dark:border-black/5 shadow-2xl">
                  {creator.avatar_url ? (
                    <Image src={creator.avatar_url} alt={creator.username} width={128} height={128} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full bg-zinc-800 dark:bg-zinc-100 flex items-center justify-center text-3xl font-black">{creator.username.charAt(0).toUpperCase()}</div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-8 h-8 rounded-full border-4 border-black dark:border-white flex items-center justify-center shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <p className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-3">The Creator</p>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tighter mb-4 leading-tight">Designed & Built by @{creator.username}</h2>
                <p className="text-gray-400 dark:text-gray-600 text-lg leading-relaxed mb-8 max-w-xl font-medium line-clamp-2">{creator.bio || "Full-stack developer focused on building high-performance web applications."}</p>
                
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <Link href={`/u/${creator.username}`} className="w-full sm:w-auto px-10 py-4 bg-white dark:bg-black text-black dark:text-white font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20 text-center">Explore Full Portfolio</Link>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">See {(projectCount || 1) - 1}+ other projects</span>
                </div>
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}