export const dynamic = "force-dynamic";

import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";

interface PageProps {
  searchParams: Promise<{
    tab?: string | string[];
  }>;
}

export default async function ResourcesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const tabParam = resolvedSearchParams.tab;
  const tab = Array.isArray(tabParam) ? tabParam[0] : tabParam || "resources";

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // PUBLIC RESOURCES (approved only)
  const { data: resources } = await supabase
    .from("resources")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  // USER RESOURCES
  const { data: myResources } = await supabase
    .from("resources")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // SERVER ACTION — ADD RESOURCE
  async function addResource(formData: FormData) {
    "use server";
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase.from("resources").insert({
      user_id: user?.id,
      title: formData.get("title"),
      url: formData.get("url"),
      description: formData.get("description"),
      status: "pending"
    });
    revalidatePath("/dashboard/resources");
  }

  // SERVER ACTION — DELETE RESOURCE
  async function deleteResource(formData: FormData){
    "use server";
    const supabase = await createServerSupabaseClient();
    await supabase
      .from("resources")
      .delete()
      .eq("id", formData.get("id"));
    revalidatePath("/dashboard/resources");
  }

  const displayedResources = tab === "resources" ? resources : myResources;

  return (
    <div className="max-w-6xl mx-auto w-full transition-colors duration-300">
      <header className="mb-10 lg:mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Developer Resources
        </h1>
        <p className="text-base text-gray-500 dark:text-gray-400 mt-2 font-medium">
          Discover tools, guides, and links curated by the community.
        </p>
      </header>

      {/* TABS */}
      <div className="flex gap-8 border-b border-gray-200/80 dark:border-white/5 mb-10 mt-4 transition-colors duration-300">
        <Link
          href="/dashboard/resources?tab=resources"
          className={`pb-4 text-sm font-bold tracking-wide transition-colors border-b-2 -mb-px cursor-pointer ${
            tab === "resources"
              ? "border-black dark:border-white text-black dark:text-white"
              : "border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-white/10"
          }`}
        >
          Public Library
        </Link>
        <Link
          href="/dashboard/resources?tab=my"
          className={`pb-4 text-sm font-bold tracking-wide transition-colors border-b-2 -mb-px cursor-pointer ${
            tab === "my"
              ? "border-black dark:border-white text-black dark:text-white"
              : "border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-white/10"
          }`}
        >
          My Submissions
        </Link>
      </div>

      {/* ADD RESOURCE FORM */}
      {tab === "my" && (
        <div className="mb-12">
          <details className="group [&_summary::-webkit-details-marker]:hidden">
            <summary className="list-none cursor-pointer inline-block mb-6 focus:outline-none">
              <div className="bg-black dark:bg-white text-white dark:text-black px-6 py-3.5 rounded-2xl flex items-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all active:scale-95 group-open:bg-gray-100 dark:group-open:bg-white/5 group-open:text-gray-800 dark:group-open:text-white group-open:hover:bg-gray-200 dark:group-open:hover:bg-white/10 font-bold shadow-md shadow-black/10">
                <span className="group-open:hidden flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                  Submit Resource
                </span>
                <span className="hidden group-open:flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  Cancel Submission
                </span>
              </div>
            </summary>

            <section className="bg-white dark:bg-[#0A0A0A] border border-gray-200/60 dark:border-white/5 rounded-4xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-10 overflow-hidden transform duration-300 origin-top transition-colors">
              <h2 className="text-2xl font-extrabold mb-8 text-gray-900 dark:text-white tracking-tight">
                Submit a new resource
              </h2>
              <form action={addResource} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1">Title</label>
                    <input
                      name="title"
                      required
                      placeholder="e.g. Next.js App Router"
                      className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/8 focus:bg-white dark:focus:bg-white/8 focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1">URL</label>
                    <input
                      name="url"
                      required
                      type="url"
                      placeholder="https://nextjs.org"
                      className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/8 focus:bg-white dark:focus:bg-white/8 focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1">Description</label>
                  <textarea
                    name="description"
                    placeholder="Why is it useful?"
                    rows={3}
                    className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/8 focus:bg-white dark:focus:bg-white/8 focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] resize-none"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-black font-bold px-8 py-3.5 rounded-2xl transition-all shadow-md shadow-black/10 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Send for Review
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                </div>
              </form>
            </section>
          </details>
        </div>
      )}

      {/* RESOURCE GRID */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {displayedResources?.map((resource) => (
          <div
            key={resource.id}
            className="group bg-white dark:bg-[#0A0A0A] border border-gray-200/60 dark:border-white/5 p-8 rounded-4xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] dark:shadow-none hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] dark:hover:bg-white/2 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
          >
            <h3 className="font-extrabold text-xl text-gray-900 dark:text-white mb-3 truncate">
              {resource.title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed line-clamp-3">
              {resource.description}
            </p>

            <div className="mt-auto pt-6 border-t border-gray-100/80 dark:border-white/5 flex flex-col gap-5">
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-bold text-sm text-black dark:text-white hover:text-gray-500 dark:hover:text-gray-400 transition-colors cursor-pointer"
              >
                Visit Resource 
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>

              {tab === "my" && (
                <div className="flex justify-between items-center bg-gray-50 dark:bg-white/5 -mx-8 -mb-8 p-5 px-8 rounded-b-4xl transition-colors">
                  {resource.status === "approved" ? (
                    <span className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 px-3 py-1.5 rounded-xl uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      Approved
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 px-3 py-1.5 rounded-xl uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                      Pending
                    </span>
                  )}

                  <form action={deleteResource}>
                    <input type="hidden" name="id" value={resource.id} />
                    <button
                      type="submit"
                      className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 p-2 rounded-xl transition-all cursor-pointer"
                      aria-label="Delete resource"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {displayedResources?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 bg-white/50 dark:bg-white/5 rounded-4xl border border-gray-200/50 dark:border-white/10 shadow-sm transition-colors">
          <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
             <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <p className="text-gray-900 dark:text-white font-extrabold text-2xl tracking-tight">
            Nothing here yet
          </p>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-2">
            {tab === "my" ? "You haven't submitted any resources." : "The public library is empty."}
          </p>
        </div>
      )}
    </div>
  );
}