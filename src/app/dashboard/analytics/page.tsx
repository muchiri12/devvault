import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import Link from "next/link";
import SafeProjectImage from "@/components/projects/SafeProjectImage";
import TrafficTable from "@/components/dashboard/TrafficTable";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const supabase = await createServerSupabaseClient();

  // 1. Get Profile
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, total_views")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/dashboard/settings");

  // 2. Fetch all views for this profile (including visitor profile info)
  const { data: views, error: viewsError } = await supabase
    .from("profile_views")
    .select(`
      viewer_ip, 
      viewer_id, 
      created_at,
      profiles:viewer_id (username, avatar_url)
    `)
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: false });

  // 3. Number Crunching
  // Total Views comes from our persistent odometer
  const totalViews = profile?.total_views || 0;

  // UNIQUE VISITORS calculation: 
  // We count how many DISTINCT identities (User ID or IP) exist in the history.
  const uniqueIdentities = new Set();
  views?.forEach(v => {
    // If logged in, the ID is the primary identity. Otherwise, use IP.
    uniqueIdentities.add(v.viewer_id || v.viewer_ip);
  });
  const uniqueVisitors = uniqueIdentities.size;

  // Calculate views in the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentViews = views?.filter(v => new Date(v.created_at) >= sevenDaysAgo).length || 0;

  return (
    <div className="p-8 max-w-6xl mx-auto dark:text-white min-h-screen">

      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Analytics
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
            Track your portfolio traffic and profile engagement.
          </p>
        </div>
        <Link
          href={`/u/${profile.username}`}
          target="_blank"
          className="px-5 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm w-fit"
        >
          View Public Portfolio ↗
        </Link>
      </div>

      {/* STAT CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        {/* Card 1: Total Views */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-colors relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
            <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          </div>
          <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 relative z-10">Total Views</p>
          <p className="text-5xl font-black text-gray-900 dark:text-white relative z-10">{totalViews}</p>
        </div>

        {/* Card 2: Unique Visitors */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-colors relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
            <svg className="w-16 h-16 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 relative z-10">Unique Visitors</p>
          <p className="text-5xl font-black text-gray-900 dark:text-white relative z-10">{uniqueVisitors}</p>
        </div>

        {/* Card 3: Last 7 Days */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-colors relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
            <svg className="w-16 h-16 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          </div>
          <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 relative z-10">Last 7 Days</p>
          <div className="flex items-baseline gap-3 relative z-10">
            <p className="text-5xl font-black text-gray-900 dark:text-white">{recentViews}</p>
            {recentViews > 0 ? (
              <span className="text-sm font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md">
                + Active
              </span>
            ) : (
              <span className="text-sm font-bold text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-md">
                Quiet
              </span>
            )}
          </div>
        </div>

      </div>

      {/* RECENT ACTIVITY LOG (Interactive Client Component) */}
      <TrafficTable views={views || []} />

    </div>
  );
}
