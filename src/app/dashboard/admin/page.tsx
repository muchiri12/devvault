import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import Link from "next/link"; 

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient();
  
  // 1. Get Profile (Security is already enforced by Middleware)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return (
    <div className="max-w-6xl mx-auto w-full pb-20 transition-colors duration-300">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-4 mb-3 mt-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Admin Panel</h1>
            <span className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest bg-black dark:bg-white text-white dark:text-black rounded-lg shadow-sm transition-colors duration-300">
              Admin Mode
            </span>
          </div>
          <p className="text-base text-gray-500 dark:text-gray-400 font-medium">System-wide management and monitoring.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Action Card 1: Resource Approvals */}
        <Link 
          href="/dashboard/admin/resources" 
          className="flex flex-col items-start p-8 md:p-10 bg-white dark:bg-[#0A0A0A] border border-gray-200/60 dark:border-white/5 rounded-4xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_12px_40px_rgba(255,255,255,0.02)] hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
        >
          <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 rounded-2xl flex items-center justify-center group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-colors duration-300 mb-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Resource Approvals</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">Review, update, and moderate incoming community resource submissions.</p>
        </Link>

        {/* Action Card 2: Manage Users */}
        <Link 
          href="/dashboard/admin/users" 
          className="flex flex-col items-start p-8 md:p-10 bg-white dark:bg-[#0A0A0A] border border-gray-200/60 dark:border-white/5 rounded-4xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_12px_40px_rgba(255,255,255,0.02)] hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
        >
          <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 rounded-2xl flex items-center justify-center group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-colors duration-300 mb-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Manage Users</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">Edit role permissions, review account status, and manage the platform user base.</p>
        </Link>

        {/* Action Card 3: View Logs */}
        <Link 
          href="/dashboard/admin/logs" 
          className="flex flex-col items-start p-8 md:p-10 bg-white dark:bg-[#0A0A0A] border border-gray-200/60 dark:border-white/5 rounded-4xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_12px_40px_rgba(255,255,255,0.02)] hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
        >
          <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 rounded-2xl flex items-center justify-center group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-colors duration-300 mb-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">View Logs</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">Monitor deep system activity, application errors, and database telemetry tracking.</p>
        </Link>

      </div>
    </div>
  );
}