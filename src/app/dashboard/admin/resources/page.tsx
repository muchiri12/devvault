export const dynamic = "force-dynamic";

import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function AdminResourcesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // FETCH PENDING RESOURCES
  const { data: pendingResources } = await supabase
    .from("resources")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  // APPROVE RESOURCE
  async function approveResource(formData: FormData) {
    "use server";
    const supabase = await createServerSupabaseClient();
    const id = formData.get("id");
    const { data: { user } } = await supabase.auth.getUser();

    await supabase
      .from("resources")
      .update({
        status: "approved",
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString()
      })
      .eq("id", id);

    revalidatePath("/dashboard/admin/resources");
  }

  // REJECT RESOURCE
  async function rejectResource(formData: FormData) {
    "use server";
    const supabase = await createServerSupabaseClient();
    const id = formData.get("id");
    const { data: { user } } = await supabase.auth.getUser();

    await supabase
      .from("resources")
      .update({
        status: "rejected",
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString()
      })
      .eq("id", id);

    revalidatePath("/dashboard/admin/resources");
  }

  return (
    <div className="max-w-6xl mx-auto w-full pb-20 transition-colors duration-300">
      
      <Link
        href="/dashboard/admin"
        className="inline-flex items-center text-sm font-bold text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors mb-10 group mt-4 uppercase tracking-wider cursor-pointer"
      >
        <svg className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Admin Panel
      </Link>

      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-4 mb-3 mt-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Resource Approvals</h1>
            <span className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest bg-black dark:bg-white text-white dark:text-black rounded-lg shadow-sm">
              Admin Mode
            </span>
          </div>
          <p className="text-base text-gray-500 dark:text-gray-400 font-medium">Review and manage community submissions.</p>
        </div>
      </header>

      {/* PENDING RESOURCES GRID */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {pendingResources?.map((resource) => (
          <div
            key={resource.id}
            className="group bg-white dark:bg-[#0A0A0A] border border-gray-200/60 dark:border-white/5 p-8 rounded-4xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_12px_40px_rgba(255,255,255,0.02)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
          >
            <h3 className="font-extrabold text-xl text-gray-900 dark:text-white mb-3 truncate group-hover:text-black dark:group-hover:text-white transition-colors leading-tight">
              {resource.title}
            </h3>
            
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed line-clamp-3">
              {resource.description}
            </p>

            {/* CARD FOOTER */}
            <div className="mt-auto pt-6 border-t border-gray-100/80 dark:border-white/5 flex flex-col gap-6">
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-bold text-black dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors w-fit cursor-pointer"
              >
                Visit Resource
                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>

              {/* APPROVE / REJECT BUTTONS */}
              <div className="flex gap-3 bg-gray-50/50 dark:bg-white/5 -mx-8 -mb-8 p-6 px-8 rounded-b-4xl border-t border-gray-100/80 dark:border-white/5">
                <form action={approveResource} className="flex-1">
                  <input type="hidden" name="id" value={resource.id} />
                  <button
                    type="submit"
                    className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 font-bold px-4 py-3 rounded-2xl text-sm transition-all shadow-md shadow-black/10 dark:shadow-white/5 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                    Approve
                  </button>
                </form>

                <form action={rejectResource} className="flex-1">
                  <input type="hidden" name="id" value={resource.id} />
                  <button
                    type="submit"
                    className="w-full bg-white dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-100 dark:hover:border-red-900/20 font-bold px-4 py-3 rounded-2xl text-sm transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                    Reject
                  </button>
                </form>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {(!pendingResources || pendingResources.length === 0) && (
        <div className="flex flex-col items-center justify-center py-24 bg-white/50 dark:bg-white/5 rounded-4xl border border-gray-200/50 dark:border-white/10 border-dashed shadow-sm mt-8 transition-colors duration-300">
          <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-5 shadow-sm border border-gray-100 dark:border-white/10">
            <svg className="w-8 h-8 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">All Caught Up!</h3>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-2">No new resources waiting for approval right now.</p>
        </div>
      )}

    </div>
  );
}