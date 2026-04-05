import { Metadata, ResolvingMetadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import Link from "next/link";
import Image from "next/image";
import { notFound, redirect, RedirectType } from "next/navigation";
import ViewTracker from "@/components/dashboard/ViewTracker";
import AnalyticsButton from "@/components/dashboard/AnalyticsButton";
import { profileService } from "@/services/profileService";
import { projectService } from "@/services/projectService";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

interface Project {
  id: string;
  user_id: string;
  title: string;
  short_description?: string;
  industry?: string;
  image_url?: string;
}

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

// THE SEO & LINK PREVIEW ENGINE
export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const username = resolvedParams.username;
  const supabase = await createServerSupabaseClient();

  const profile = await profileService.getByUsername(supabase, username);

  if (!profile) {
    return {
      title: "Portfolio Not Found | DevVault",
      description: "This developer portfolio could not be located.",
    };
  }

  const title = `${profile.username} | Developer Portfolio`;
  const description = profile.bio || `Check out ${profile.username}'s latest case studies and projects on DevVault.`;
  const ogImage = profile.avatar_url || "https://devvault.com/default-og.png";

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: `https://devvault.com/u/${profile.username}`,
      siteName: "DevVault",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `@${profile.username}'s Developer Profile`,
        },
      ],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [ogImage],
    },
  };
}

import { LegalLinks } from "@/components/shared/LegalLinks";

export default async function PublicPortfolio({ params }: PageProps) {
  const resolvedParams = await params;
  const username = resolvedParams.username;
  const supabase = await createServerSupabaseClient();

  // 1. FETCH PROFILE
  const profile = await profileService.getByUsername(supabase, username);

  // If no user exists, check history
  if (!profile) {
    const { data: history } = await supabase
      .from("username_history")
      .select("profiles(username)")
      .eq("old_username", username)
      .order("changed_at", { ascending: false })
      .limit(1)
      .single();

    const profileData = history?.profiles as any;
    if (profileData?.username) {
      redirect(`/u/${profileData.username}`, RedirectType.replace);
    }
    notFound();
  }

  // 2. FETCH PROJECTS
  const projects = await projectService.getProjectsByUsername(supabase, username) as Project[];

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050505] text-black dark:text-white relative z-0 py-16 px-4 sm:px-6 transition-colors duration-300">
      <ViewTracker profileId={profile.id} />
      
      {/* Background linear gradient */}
      <div className="absolute inset-0 z-[-1] bg-linear-to-b from-white dark:from-[#0A0A0A] via-[#FAFAFA] dark:via-[#050505] to-[#F2F2F2] dark:to-[#000000] transition-colors duration-300" />

      <div className="max-w-5xl mx-auto relative z-10 font-sans">

        {/* PROFILE HEADER */}
        <header className="mb-16 flex flex-col md:flex-row items-start md:items-center gap-8 bg-white/60 dark:bg-black/40 backdrop-blur-3xl p-8 md:p-10 rounded-[3rem] border border-gray-200/50 dark:border-white/5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] transition-all">
          <div className="w-24 h-24 md:w-28 md:h-28 relative rounded-full overflow-hidden bg-gray-100 dark:bg-zinc-800 border-4 border-white dark:border-zinc-900 shadow-[0_8px_16px_rgba(0,0,0,0.08)] shrink-0">
            {profile.avatar_url ? (
              <Image src={profile.avatar_url} alt={profile.username} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-zinc-800">
                <span className="text-2xl font-bold uppercase">{profile.username.charAt(0)}</span>
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2 leading-tight">
              @{profile.username}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl leading-relaxed font-medium">
              {profile.bio || "This developer hasn't added a bio yet."}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-8">
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-11 h-11 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                </a>
              )}
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-11 h-11 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .08 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" /></svg>
                </a>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-11 h-11 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                </a>
              )}
              {profile.twitter && (
                <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-11 h-11 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </a>
              )}
              <div className="ml-auto">
                <AnalyticsButton profileId={profile.id} />
              </div>
            </div>
          </div>
        </header>

        {/* PROJECTS SECTION */}
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Case Studies</h2>
          <Badge>{projects.length || 0} Project{projects.length !== 1 ? 's' : ''}</Badge>
        </div>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-gray-50/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 border-dashed rounded-[3rem] p-20 shadow-sm transition-colors">
            <Card border={false} hover={false} className="w-16 h-16 !p-0 bg-white dark:bg-[#0A0A0A] rounded-2xl flex items-center justify-center mb-5 shadow-sm border border-gray-100 dark:border-white/10">
              <svg className="w-8 h-8 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </Card>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">No projects yet</h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium max-w-sm text-center leading-relaxed">This developer hasn&#39;t published any public projects to their portfolio.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`} className="group">
                <Card className="!p-0 !rounded-[2.5rem] overflow-hidden flex flex-col h-full bg-white dark:bg-black/40">
                  {project.image_url ? (
                    <div className="relative w-full aspect-video bg-gray-100 dark:bg-zinc-800 border-b border-gray-100 dark:border-white/5 shrink-0 overflow-hidden">
                      <Image src={project.image_url} alt={project.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="w-full aspect-video bg-gray-50 dark:bg-zinc-900 flex items-center justify-center border-b border-gray-100 dark:border-white/5 shrink-0">
                      <svg className="w-10 h-10 text-gray-300 dark:text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                  )}

                  <div className="p-8 flex flex-col flex-1">
                    <Badge variant="default" className="w-fit mb-4">
                      {project.industry || "Software"}
                    </Badge>
                    <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2 leading-tight truncate transition-colors group-hover:text-black dark:group-hover:text-white">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed font-medium mb-6 flex-1">
                      {project.short_description}
                    </p>
                    <div className="mt-auto pt-6 border-t border-gray-100/60 dark:border-white/5 flex items-center text-sm font-bold text-gray-400 dark:text-gray-500 group-hover:text-black dark:group-hover:text-white transition-all">
                      Case Study
                      <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
      <footer className="max-w-5xl mx-auto px-6 py-12 mt-16 border-t border-gray-200/50 dark:border-white/5">
        <LegalLinks />
      </footer>
    </div>
  );
}