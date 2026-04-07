import { createServerSupabaseClient } from "@/lib/supabaseServer";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import SafeProjectImage from "@/components/projects/SafeProjectImage";
import ViewTracker from "@/components/dashboard/ViewTracker";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

import { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const projectId = resolvedParams.id;
  
  // NOTE: In Next.js 14+, you can just use Supabase to fetch exactly what's needed for the tags.
  // We recreate the client here because it's a completely separate lifecycle from the page component.
  const supabase = await createServerSupabaseClient();
  
  const { data: project } = await supabase
    .from("projects")
    .select("title, short_description, image_url, user_id")
    .eq("id", projectId)
    .single() as { data: Project | null };

  if (!project) return { title: "Project Not Found | DevVault" };

  const { data: creator } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", project.user_id)
    .single() as { data: Profile | null };

  const username = creator?.username || "Unknown Developer";
  const ogImages = project.image_url ? [{ url: project.image_url, width: 1200, height: 630, alt: project.title }] : [];

  return {
    title: `${project.title} by @${username} | DevVault`,
    description: project.short_description || `View ${project.title} on DevVault.`,
    openGraph: {
      title: `${project.title} | Hosted on DevVault`,
      description: project.short_description || `View ${project.title} on DevVault.`,
      images: ogImages,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} by @${username}`,
      description: project.short_description || `View ${project.title} on DevVault.`,
      images: ogImages,
    },
  };
}

interface Project {
  id: string;
  user_id: string;
  title: string;
  short_description?: string;
  industry?: string;
  role?: string;
  duration?: string;
  image_url?: string;
  problem?: string;
  process?: string;
  solution?: string;
  outcome?: string;
  live_demo?: string;
  github_repo?: string;
}

interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  bio?: string;
}

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
  const isFromExplore = resolvedSearchParams.source === "explore";

  const supabase = await createServerSupabaseClient();

  // 1. FETCH PROJECT
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single() as { data: Project | null };

  if (!project) notFound();

  // 2. FETCH THE CREATOR'S PROFILE
  const { data: creator } = await supabase
    .from("profiles")
    .select("username, avatar_url, bio, id")
    .eq("id", project.user_id)
    .single() as { data: Profile | null };

  if (!creator) notFound();

  // 3. FETCH PROJECT COUNT
  const { count: projectCount } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("user_id", creator.id);

  // 4. FETCH GALLERY
  const { data: images } = await supabase
    .from("project_images")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050505] text-black dark:text-white relative z-0 pb-24 font-sans">
      <ViewTracker profileId={creator.id} />
      
      <div className="absolute inset-0 z-[-1] bg-gradient-to-b from-gray-100/50 dark:from-white/5 via-transparent to-transparent pointer-events-none" />

      {/* STICKY CREATOR HEADER */}
      {isFromDashboard && (
        <div className="sticky top-0 z-50 w-full bg-white/80 dark:bg-[#050505]/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/5">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-200/50 dark:border-white/10">
                {creator.avatar_url ? (
                  <Image src={creator.avatar_url} alt={creator.username} width={40} height={40} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 font-bold">{creator.username.charAt(0).toUpperCase()}</div>
                )}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-extrabold">Built by</p>
                <p className="text-sm font-extrabold pb-0.5">@{creator.username}</p>
              </div>
            </div>
            <Button variant="primary" size="sm" href={`/u/${creator.username}`} className="rounded-full px-6">
              Full Portfolio
            </Button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 mt-12 relative z-10">

        <Button variant="ghost" size="sm" href={isFromDashboard ? `/dashboard/projects/${projectId}` : isFromExplore ? "/explore" : `/u/${creator.username}`} className="!p-2 -ml-2 mb-10 group">
          <svg className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          <span className="uppercase tracking-widest text-[10px] font-extrabold">{isFromDashboard ? "Back to Manage" : isFromExplore ? "Back to Explore" : "Back to Portfolio"}</span>
        </Button>

        <header className="mb-14 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{project.industry || "Developer Showcase"}</Badge>
            {project.role && <Badge variant="default">{project.role}</Badge>}
            {project.duration && <Badge variant="default">{project.duration}</Badge>}
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-[1.05]">
            {project.title}
          </h1>

          {project.live_demo && (
            <div className="pt-4">
              <Button href={project.live_demo as string} target="_blank" rel="noopener noreferrer" size="lg" className="px-10 rounded-2xl group shadow-2xl shadow-black/10 dark:shadow-white/5" icon={<svg className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>}>
                Live Demo
              </Button>
            </div>
          )}
        </header>

        {/* HERO */}
        {project.image_url && (
          <div className="relative w-full aspect-video rounded-[3.5rem] overflow-hidden bg-gray-50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5 shadow-2xl mb-20 group">
            <SafeProjectImage src={project.image_url} alt={project.title} sizes="(max-width:1024px) 100vw, 896px" priority className="object-cover transition-transform duration-[2s] group-hover:scale-105" />
          </div>
        )}

        {/* OVERVIEW */}
        {project.short_description && (
          <section className="mb-20 space-y-8">
            <Badge>Executive Summary</Badge>
            <Card className="p-10 md:p-16">
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium whitespace-pre-wrap">
                {project.short_description}
              </p>
            </Card>
          </section>
        )}

        {/* CASE STUDY BLOCKS */}
        <div className="space-y-12 mb-24">
          {[
            { label: "The Problem", content: project.problem, color: "bg-rose-500", tag: "P" },
            { label: "The Process", content: project.process, color: "bg-blue-500", tag: "W" },
            { label: "The Solution", content: project.solution, color: "bg-emerald-500", tag: "S" },
            { label: "The Outcome", content: project.outcome, color: "bg-purple-500", tag: "O" }
          ].map((block, idx) => block.content && (
            <section key={idx} className="space-y-6">
              <Badge>{block.label}</Badge>
              <Card className="relative overflow-hidden group p-10 md:p-16">
                <div className={`absolute top-0 left-0 w-1.5 h-full ${block.color} group-hover:w-2.5 transition-all duration-500`} />
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-medium whitespace-pre-wrap pl-2">
                  {block.content}
                </p>
              </Card>
            </section>
          ))}
        </div>

        {/* GALLERY */}
        {images && images.length > 0 && (
          <div className="mb-24 space-y-10">
            <Badge>Visual Gallery</Badge>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {images.map((img) => (
                <div key={img.id} className="group relative aspect-video rounded-[2.5rem] overflow-hidden border border-gray-200/50 dark:border-white/5 shadow-xl bg-gray-50 dark:bg-white/5 transition-all hover:scale-[1.02] duration-700">
                  <SafeProjectImage src={img.image_url} alt="Gallery" sizes="(max-width:768px) 100vw, 50vw" className="object-cover group-hover:scale-110 transition-transform duration-[1.5s]" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONVERSION FOOTER */}
        <section className="bg-black dark:bg-white p-10 sm:p-16 rounded-[4rem] text-white dark:text-black shadow-2xl relative overflow-hidden group mb-20">
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 dark:bg-black/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-[3s]" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="shrink-0 relative">
              <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white/20 dark:border-black/5 shadow-2xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center">
                {creator.avatar_url ? (
                  <SafeProjectImage src={creator.avatar_url} alt={creator.username} sizes="144px" className="object-cover w-full h-full" />
                ) : (
                  <div className="text-4xl font-black">{creator.username.charAt(0).toUpperCase()}</div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-10 h-10 rounded-full border-4 border-black dark:border-white shadow-xl flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-6">
              <div className="space-y-2">
                <p className="text-[11px] uppercase font-black tracking-[0.25em] text-gray-400 dark:text-gray-400">Collaborate with this Talent</p>
                <h2 className="text-4xl sm:text-5xl font-black tracking-tighter leading-tight">Designed & Built by @{creator.username}</h2>
              </div>
              <p className="text-gray-400 dark:text-gray-600 text-xl leading-relaxed font-bold line-clamp-2">{creator.bio || "Crafting digital experiences with precision and strategic depth."}</p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-8 pt-4">
                <Button href={`/u/${creator.username}`} size="lg" className="w-full sm:w-auto px-12 rounded-[1.25rem] shadow-2xl shadow-emerald-500/10">
                  Explore Full Portfolio
                </Button>
                <div className="flex flex-col items-center sm:items-start">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    Available for Work
                  </span>
                  <span className="text-xs font-extrabold text-white/40 dark:text-black/40">
                    {projectCount ? `${projectCount} Live Case Studies` : "Open to opportunities"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="max-w-7xl mx-auto px-8 py-14 border-t border-gray-200/50 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-500 mt-auto">
        <span>© {new Date().getFullYear()} DevVault</span>
        <div className="flex items-center gap-8">
          <Link href="/explore" className="hover:text-black dark:hover:text-white transition-colors">Global Explore</Link>
          <Link href="/register" className="hover:text-black dark:hover:text-white transition-colors">Claim your vault</Link>
        </div>
      </footer>
    </div>
  );
}