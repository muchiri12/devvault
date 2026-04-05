import { createServerSupabaseClient } from "@/lib/supabaseServer";
import Link from "next/link";
import DraggableProjectList from "@/components/projects/DraggableProjectList";
import SafeProjectImage from "@/components/projects/SafeProjectImage";
import { projectService } from "@/services/projectService";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

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

  if (!user) return null;

  // 1. FETCH DATA VIA SERVICES
  const projects = await projectService.getPublicProjects(supabase);
  const myProjects = await projectService.getUserProjects(supabase, user.id);

  const displayedProjects = tab === "projects" ? projects : myProjects;

  return (
    <div className="max-w-6xl mx-auto w-full transition-colors duration-300 font-sans">
      <header className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
            Projects
          </h1>
          <p className="text-base text-gray-500 dark:text-gray-400 mt-2 font-medium">Manage and explore community projects.</p>
        </div>

        <Button href="/dashboard/projects/new" size="lg" className="w-full sm:w-auto">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Add Project
        </Button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <Card className="flex flex-col !p-6">
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Your Projects</span>
          <span className="text-3xl font-extrabold text-gray-900 dark:text-white leading-none">{myProjects.length}</span>
        </Card>
        <Card className="flex flex-col !p-6">
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Community</span>
          <span className="text-3xl font-extrabold text-gray-900 dark:text-white leading-none">{projects.length}</span>
        </Card>
      </div>

      <div className="flex gap-8 border-b border-gray-200/80 dark:border-white/5 mb-10 transition-all">
        <Link
          href="/dashboard/projects?tab=projects"
          className={`pb-4 text-sm font-bold tracking-wide transition-all border-b-2 -mb-px ${
            tab === "projects"
              ? "border-black dark:border-white text-black dark:text-white"
              : "border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-white"
          }`}
        >
          Public Projects
        </Link>
        <Link
          href="/dashboard/projects?tab=my"
          className={`pb-4 text-sm font-bold tracking-wide transition-all border-b-2 -mb-px ${
            tab === "my"
              ? "border-black dark:border-white text-black dark:text-white"
              : "border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-white"
          }`}
        >
          My Projects
        </Link>
      </div>

      {tab === "my" ? (
        <DraggableProjectList initialProjects={myProjects} />
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {displayedProjects.map((project, index) => (
            <Link key={project.id} href={project.user_id === user.id ? `/dashboard/projects/${project.id}` : `/projects/${project.id}?source=dashboard`} className="group">
              <Card className="!p-0 !rounded-[2.5rem] overflow-hidden flex flex-col h-full">
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
                      <svg className="w-10 h-10 text-gray-300 dark:text-gray-700 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <span className="text-[10px] font-extrabold text-gray-400 dark:text-gray-600 uppercase tracking-widest">No Image</span>
                    </div>
                  )}
                </div>

                <div className="p-8 flex flex-col grow">
                  <div className="flex items-center gap-2.5 mb-4 font-medium">
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
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">@{profile.username}</span>
                          </>
                        );
                      })()
                    )}
                  </div>

                  <h3 className="font-extrabold text-xl mb-2 text-gray-900 dark:text-white transition-colors leading-tight truncate group-hover:text-black dark:group-hover:text-white">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-6 leading-relaxed font-medium flex-1">
                    {project.short_description}
                  </p>

                  <div className="mt-auto pt-6 border-t border-gray-100/80 dark:border-white/5 flex items-center text-sm font-bold text-gray-400 dark:text-gray-500 group-hover:text-black dark:group-hover:text-white transition-all">
                    View Project
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {(!displayedProjects || displayedProjects.length === 0) && (
        <div className="flex flex-col items-center justify-center py-24 bg-gray-50/50 dark:bg-white/5 rounded-[3rem] border border-gray-200/50 dark:border-white/10 border-dashed shadow-sm mt-8 transition-all">
          <Card border={false} hover={false} className="w-16 h-16 !p-0 bg-white dark:bg-[#0A0A0A] rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-gray-100 dark:border-white/10">
            <svg className="w-8 h-8 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </Card>
          <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Nothing here yet</h3>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-2 mb-8">Click &#34;Add Project&#34; to launch your first one.</p>
          <Button href="/dashboard/projects/new" size="lg">Add Project</Button>
        </div>
      )}
    </div>
  );
}