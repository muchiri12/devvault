import { createServerSupabaseClient } from "@/lib/supabaseServer";
import Link from "next/link";
import SafeProjectImage from "@/components/SafeProjectImage";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Explore Projects | DevVault",
  description: "Browse developer projects and case studies from the DevVault community. No account required.",
};

export default async function ExplorePage() {
  const supabase = await createServerSupabaseClient();

  // Fetch all projects with creator profile
  const { data: projects } = await supabase
    .from("projects")
    .select("id, title, short_description, image_url, user_id, created_at, profiles!inner(username, avatar_url)")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050505] text-gray-900 dark:text-white font-sans relative z-0 transition-colors duration-300">

      {/* Background gradient */}
      <div className="absolute inset-0 z-[-1] bg-linear-to-b from-white dark:from-[#0A0A0A] via-[#FAFAFA] dark:via-[#050505] to-[#F2F2F2] dark:to-[#000000] pointer-events-none" />

      {/* Full-width sticky header */}
      <div className="sticky top-0 z-50 w-full bg-[#FAFAFA]/90 dark:bg-[#050505]/90 backdrop-blur-md border-b border-gray-200/40 dark:border-white/5 transition-colors duration-300">
        <nav className="flex items-center justify-between px-5 md:px-12 py-4 max-w-7xl mx-auto w-full">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-black dark:bg-white rounded-xl flex items-center justify-center shadow-md transform transition-all group-hover:scale-110 duration-300 shrink-0">
              <div className="w-3 h-3 bg-white dark:bg-black rounded-sm rotate-45 transform group-hover:rotate-90 transition-transform duration-500" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-white">DevVault</span>
          </Link>

          <div className="flex items-center gap-2 md:gap-4 text-sm font-medium">
            <Link href="/login" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200 px-2 py-1.5">
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-black dark:bg-white text-white dark:text-black px-4 md:px-5 py-2 rounded-xl hover:bg-gray-900 dark:hover:bg-gray-100 active:scale-95 font-bold text-sm transition-all shadow-md whitespace-nowrap"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </div>

      {/* Sign-in nudge banner */}
      <div className="bg-black dark:bg-white text-white dark:text-black px-5 py-3 text-center text-sm font-medium transition-colors duration-300">
        <span className="opacity-80">Want to showcase your own projects?</span>{" "}
        <Link href="/register" className="font-extrabold underline underline-offset-2 hover:no-underline transition-all">
          Create a free account →
        </Link>
      </div>

      {/* Page header */}
      <div className="max-w-7xl mx-auto px-5 md:px-12 pt-14 pb-8">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
            Community Projects
          </h1>
          <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 font-medium max-w-xl">
            {projects?.length ?? 0} project{projects?.length !== 1 ? "s" : ""} built by the DevVault community.
          </p>
        </div>

        {/* Projects grid */}
        {projects && projects.length > 0 ? (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {projects.map((project, index) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}?source=explore`}
                className="group flex flex-col h-full bg-white dark:bg-[#0A0A0A] rounded-[2rem] border border-gray-200/60 dark:border-white/5 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_12px_40px_rgba(255,255,255,0.02)] hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
              >
                <div className="relative w-full h-52 bg-gray-50 dark:bg-white/5 overflow-hidden border-b border-gray-100/80 dark:border-white/5">
                  {project.image_url ? (
                    <SafeProjectImage
                      src={project.image_url}
                      alt={project.title || "Project thumbnail"}
                      sizes="(max-width:768px) 100vw, 33vw"
                      priority={index < 2}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <svg className="w-10 h-10 text-gray-300 dark:text-gray-700 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">No Image</span>
                    </div>
                  )}
                </div>

                <div className="p-7 flex flex-col grow">
                  <div className="flex items-center gap-2.5 mb-4">
                    {project.profiles && (
                      (() => {
                        const profile: any = Array.isArray(project.profiles) ? project.profiles[0] : project.profiles;
                        if (!profile) return null;
                        return (
                          <>
                            <div className="w-6 h-6 relative rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 shrink-0">
                              {profile.avatar_url ? (
                                <SafeProjectImage src={profile.avatar_url} alt={profile.username} className="object-cover w-full h-full" sizes="24px" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-500 dark:text-gray-400">
                                  {profile.username?.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                              @{profile.username}
                            </span>
                          </>
                        );
                      })()
                    )}
                  </div>
                  <h2 className="font-extrabold text-xl mb-2 text-gray-900 dark:text-white leading-tight truncate group-hover:text-black dark:group-hover:text-white transition-colors">
                    {project.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-6 leading-relaxed">
                    {project.short_description}
                  </p>
                  <div className="mt-auto pt-5 border-t border-gray-100/80 dark:border-white/5 flex items-center text-sm font-bold text-gray-400 dark:text-gray-500 group-hover:text-black dark:group-hover:text-white transition-colors">
                    View Project
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-gray-50/50 dark:bg-white/5 rounded-[3rem] border border-gray-200/50 dark:border-white/10 border-dashed shadow-sm">
            <div className="w-16 h-16 bg-white dark:bg-[#0A0A0A] rounded-2xl flex items-center justify-center mb-5 shadow-sm border border-gray-100 dark:border-white/10">
              <svg className="w-8 h-8 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">No projects yet</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium mt-2 mb-6">Be the first to showcase your work.</p>
            <Link
              href="/register"
              className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              Create an Account
            </Link>
          </div>
        )}
      </div>

      {/* Simple footer */}
      <footer className="max-w-7xl mx-auto px-5 md:px-12 py-12 mt-8 border-t border-gray-200/50 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400 dark:text-gray-500 font-medium">
        <span>© {new Date().getFullYear()} DevVault</span>
        <div className="flex items-center gap-5">
          <Link href="/login" className="hover:text-black dark:hover:text-white transition-colors">Sign In</Link>
          <Link href="/register" className="hover:text-black dark:hover:text-white transition-colors">Get Started</Link>
        </div>
      </footer>
    </div>
  );
}
