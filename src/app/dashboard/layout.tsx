export const dynamic = "force-dynamic";

import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import DashboardNav from "@/components/dashboard/DashboardNav";
import MobileSidebar from "@/components/dashboard/MobileSidebar";
import Image from "next/image";
import Link from "next/link";
import { LegalLinks } from "@/components/shared/LegalLinks";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null; // Fallback for type safety, though middleware already handles this.

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  async function handleLogout() {
    "use server";
    const supabaseClient = await createServerSupabaseClient();
    await supabaseClient.auth.signOut();
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050505] text-black dark:text-white font-sans flex flex-col selection:bg-black dark:selection:bg-white selection:text-white dark:selection:text-black transition-colors duration-300">

      {/* ── MOBILE TOP BAR ── */}
      <MobileSidebar
        isAdmin={profile?.role === "admin"}
        username={profile?.username || ""}
        avatarUrl={profile?.avatar_url || undefined}
        logoutAction={handleLogout}
      />

      {/* ── DESKTOP CONTENT AREA ── */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebar - Fixed for a rock-solid feel */}
        <aside className="hidden md:flex fixed left-0 top-0 h-screen w-60 lg:w-72 bg-white dark:bg-[#0A0A0A] flex-col p-4 lg:p-6 shrink-0 border-r border-gray-200/60 dark:border-white/5 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-40 transition-colors duration-300">
          <div className="flex items-center gap-3 lg:gap-4 mb-8 px-3 mt-2">
            <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center bg-black dark:bg-white shadow-lg transform transition-transform hover:scale-105 duration-300">
              <div className="w-3 h-3 lg:w-3.5 lg:h-3.5 bg-white dark:bg-black rounded-sm rotate-45" />
            </div>
            <span className="text-xl lg:text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">DevVault</span>
          </div>

          <DashboardNav isAdmin={profile?.role === "admin"} />

          <div className="mt-auto px-2 pb-4 space-y-2 border-t border-gray-100/80 dark:border-white/5 pt-6">
            <Link href="/dashboard/profile/edit" className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group cursor-pointer">
              <div className="w-9 h-9 lg:w-10 lg:h-10 relative rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/10 shrink-0">
                {profile?.avatar_url ? (
                  <Image src={profile.avatar_url} alt="Avatar" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 font-bold bg-gray-100 dark:bg-gray-800">
                    {profile?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-black dark:group-hover:text-white">
                  @{profile?.username || "developer"}
                </span>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate tracking-tight">Manage Account</span>
              </div>
            </Link>
          
            <form action={handleLogout} className="w-full">
              <button className="w-full flex items-center justify-center gap-3 text-gray-400 dark:text-zinc-500 bg-gray-50 dark:bg-zinc-900/40 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/10 px-5 py-3 rounded-2xl transition-all duration-300 font-bold group border border-gray-100 dark:border-white/5 cursor-pointer shadow-sm active:scale-95 text-[11px] uppercase tracking-widest">
                <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </form>
          </div>
        </aside>

        {/* Main Content Scroll Area - Offset by fixed sidebar width */}
        <main className="flex-1 md:ml-60 lg:ml-72 overflow-auto relative min-w-0 flex flex-col pt-4 sm:pt-6 md:pt-8 lg:pt-12 xl:pt-16">
          <div className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 relative">
            <div className="absolute top-0 left-0 right-0 h-96 bg-linear-to-b from-white dark:from-[#050505] to-transparent opacity-60 dark:opacity-40 pointer-events-none -z-10" />
            {children}
          </div>

          {/* ── GITHUB-STYLE CONTENT FOOTER ── */}
          <footer className="mt-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-10 border-t border-gray-100 dark:border-white/5 opacity-75 hover:opacity-100 transition-opacity duration-500">
            <LegalLinks justify="start" direction="row" />
          </footer>
        </main>
      </div>

      {/* Full-width footer removed for cleaner sidebar integration */}
    </div>
  );
}