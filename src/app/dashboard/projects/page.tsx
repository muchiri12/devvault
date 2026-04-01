export const dynamic = "force-dynamic";

import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import DraggableProjectList from "@/components/DraggableProjectList";

interface PageProps {
  searchParams: Promise<{
    tab?: string | string[];
  }>;
}

export default async function ProjectsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;

  const tabParam = resolvedSearchParams.tab;
  const tab = Array.isArray(tabParam) ? tabParam[0] : tabParam || "projects";

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // PUBLIC PROJECTS
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  // MY projecTs
  const { data: myProjects } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  const displayedProjects = tab === "projects" ? projects : myProjects;

  return (
    <div className="max-w-6xl mx-auto w-full transition-colors duration-300">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Projects
          </h1>
          <p className="text-base text-gray-500 dark:text-gray-400 mt-2 font-medium">Manage and explore community projects.</p>
        </div>

        <Link
          href="/dashboard/projects/new"
          className="inline-flex items-center justify-center bg-black dark:bg-white text-white dark:text-black px-8 py-3.5 rounded-2xl text-sm font-bold transition-all shadow-md hover:bg-gray-900 dark:hover:bg-gray-100 active:scale-95 whitespace-nowrap cursor-pointer"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Add Project
        </Link>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="p-5 bg-white dark:bg-[#0A0A0A] rounded-2xl border border-gray-200/60 dark:border-white/5 shadow-sm flex flex-col transition-colors duration-300">
          <span className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Your Projects</span>
          <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{myProjects?.length || 0}</span>
        </div>
        <div className="p-5 bg-white dark:bg-[#0A0A0A] rounded-2xl border border-gray-200/60 dark:border-white/5 shadow-sm flex flex-col transition-colors duration-300">
          <span className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Community</span>
          <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{projects?.length || 0}</span>
        </div>
      </div>

      <div className="flex gap-8 border-b border-gray-200/80 dark:border-white/5 mb-10 mt-4 transition-colors duration-300">
        <Link
          href="/dashboard/projects?tab=projects"
          className={`pb-4 text-sm font-bold tracking-wide transition-colors border-b-2 -mb-px cursor-pointer ${
            tab === "projects"
              ? "border-black dark:border-white text-black dark:text-white"
              : "border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-white hover:border-gray-300 dark:hover:border-white/20"
          }`}
        >
          Public Projects
        </Link>

        <Link
          href="/dashboard/projects?tab=my"
          className={`pb-4 text-sm font-bold tracking-wide transition-colors border-b-2 -mb-px cursor-pointer ${
            tab === "my"
              ? "border-black dark:border-white text-black dark:text-white"
              : "border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-white hover:border-gray-300 dark:hover:border-white/20"
          }`}
        >
          My Projects
        </Link>
      </div>

      {tab === "my" ? (
        <DraggableProjectList initialProjects={myProjects || []} />
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {displayedProjects?.map((project) => (
            <Link
              key={project.id}
              href={project.user_id === user.id ? `/dashboard/projects/${project.id}` : `/projects/${project.id}?source=dashboard`}
              className="group flex flex-col h-full bg-white dark:bg-[#0A0A0A] rounded-4xl border border-gray-200/60 dark:border-white/5 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_12px_40px_rgba(255,255,255,0.02)] hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
            >
              {project.image_url ? (
                 <div className="relative w-full h-52 bg-gray-50 dark:bg-white/5 overflow-hidden border-b border-gray-100/80 dark:border-white/5">
                   <Image
                     src={project.image_url}
                     alt={project.title || "Project thumbnail"}
                     fill
                     sizes="(max-width:768px) 100vw, 33vw"
                     className="object-cover group-hover:scale-105 transition-transform duration-500"
                   />
                 </div>
              ) : (
                 <div className="relative w-full h-52 bg-gray-50 dark:bg-white/5 flex flex-col items-center justify-center border-b border-gray-100/80 dark:border-white/5">
                   <svg className="w-10 h-10 text-gray-300 dark:text-gray-700 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                   </svg>
                   <span className="text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">No Image</span>
                 </div>
              )}

              <div className="p-8 flex flex-col grow">
                <h3 className="font-extrabold text-xl mb-3 text-gray-900 dark:text-white transition-colors leading-tight truncate group-hover:text-black dark:group-hover:text-white">
                  {project.title}
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-8 leading-relaxed">
                  {project.short_description}
                </p>

                <div className="mt-auto pt-6 border-t border-gray-100/80 dark:border-white/5 flex items-center text-sm font-bold transition-colors group-hover:text-black dark:group-hover:text-white">
                  View Project
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {(!displayedProjects || displayedProjects.length === 0) && (
        <div className="flex flex-col items-center justify-center py-24 bg-gray-50/50 dark:bg-white/5 rounded-4xl border border-gray-200/50 dark:border-white/10 border-dashed shadow-sm mt-8 transition-colors duration-300">
          <div className="w-16 h-16 bg-white dark:bg-[#0A0A0A] rounded-2xl flex items-center justify-center mb-5 shadow-sm border border-gray-100 dark:border-white/10">
            <svg className="w-8 h-8 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Nothing here yet</h3>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-2">Click &#34;Add Project&#34; to launch your first one.</p>
        </div>
      )}
    </div>
  );
}