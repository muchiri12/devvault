import { createServerSupabaseClient } from "@/lib/supabaseServer";
import Image from "next/image";
import Link from "next/link";

export default async function DashboardOverviewPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  return (
    <>
      <header className="flex justify-between items-center mb-12 max-w-5xl">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-base text-gray-500 dark:text-gray-400 mt-2 font-medium transition-colors duration-300">
            Welcome back {profile?.username ? <span className="text-black dark:text-white font-bold transition-colors duration-300">@{profile.username}</span> : ""}, here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl text-white dark:text-black flex items-center justify-center font-extrabold text-xl shadow-[0_8px_16px_rgba(0,0,0,0.15)] ring-4 ring-white dark:ring-[#050505] transform transition-transform hover:scale-105 duration-300 cursor-pointer overflow-hidden relative border border-gray-200/50 dark:border-white/10 bg-black dark:bg-white">
            {profile?.avatar_url ? (
              <Image src={profile.avatar_url} alt="Profile Avatar" fill className="object-cover" />
            ) : (
              profile?.email?.[0].toUpperCase()
            )}
          </div>
        </div>
      </header>

      {/* Content Card */}
      <div className="w-full max-w-6xl bg-white dark:bg-[#0A0A0A] border border-gray-200/60 dark:border-white/5 rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden min-h-[500px] flex flex-col transition-all duration-300">
        <div className="border-b border-gray-100 dark:border-white/5 bg-gray-50/30 dark:bg-white/5 p-8 sm:p-10 shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Active Profile Details</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">Your authenticated user session details.</p>
          </div>
          
          {profile?.username && (
            <Link 
              href={`/u/${profile.username}`} 
              target="_blank"
              className="inline-flex items-center justify-center gap-2 bg-white dark:bg-white/5 text-gray-900 dark:text-white border border-gray-200/80 dark:border-white/10 px-5 py-2.5 rounded-xl font-bold shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:bg-gray-50 dark:hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300 active:scale-95 cursor-pointer"
            >
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
              View Public Portfolio
            </Link>
          )}
        </div>
        
        <div className="p-8 sm:p-10 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Email Address
              </p>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 flex items-center justify-center shadow-sm transition-colors text-black dark:text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <p className="text-lg text-gray-900 dark:text-white font-bold truncate">
                  {profile?.email || user?.email}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Account Role
              </p>
              <div className="flex items-center h-[74px]">
                <span className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl text-sm font-bold text-white dark:text-black capitalize shadow-md transform transition-transform hover:scale-105 duration-200 bg-black dark:bg-white">
                  <div className="w-2.5 h-2.5 rounded-full bg-white dark:bg-black animate-pulse" />
                  {profile?.role || "user"}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Username
              </p>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 group">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 flex items-center justify-center shadow-sm transition-colors text-black dark:text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                </div>
                <p className="text-lg text-gray-900 dark:text-white font-bold truncate">
                  @{profile?.username || "unknown"}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}