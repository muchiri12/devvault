import { createServerSupabaseClient } from "@/lib/supabaseServer";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function DashboardOverviewPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  return (
    <div className="max-w-5xl space-y-12 pb-20 font-sans">
      
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg font-medium leading-relaxed">
            Welcome back {profile?.username ? <span className="text-black dark:text-white font-bold">@{profile.username}</span> : "to your profile"}.
          </p>
        </div>
        
        {/* Avatar Primitive */}
        <div className="w-16 h-16 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-extrabold text-2xl shadow-xl ring-4 ring-gray-50 dark:ring-white/5 overflow-hidden relative">
          {profile?.avatar_url ? (
            <Image src={profile.avatar_url} alt="Profile Avatar" fill className="object-cover" />
          ) : (
            profile?.email?.[0].toUpperCase()
          )}
        </div>
      </header>

      {/* Profile Overview Card */}
      <Card border={false} className="!p-0 overflow-hidden bg-white dark:bg-[#0A0A0A] border border-gray-100  shadow-2xl shadow-black/5   :">
        
        {/* Card Header */}
        <div className="p-8 sm:p-10 border-b border-gray-50 dark:border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Active Profile Details</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium italic">Your authenticated developer session.</p>
          </div>
          
          {profile?.username && (
            <Button 
              variant="secondary" 
              href={`/u/${profile.username}`} 
              target="_blank"
              icon={<svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>}
            >
              View Public Portfolio
            </Button>
          )}
        </div>
        
        {/* Grid Stats Area */}
        <div className="p-8 sm:p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          
          <div className="space-y-4">
            <label className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Email Identity</label>
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 text-gray-400 group-hover:text-black dark:hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <p className="text-lg text-gray-900 dark:text-white font-extrabold truncate">{profile?.email || user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Username</label>
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 text-gray-400 group-hover:text-black dark:hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
              </div>
              <p className="text-lg text-gray-900 dark:text-white font-extrabold truncate">@{profile?.username || "unknown"}</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Account Role</label>
            <div className="pt-1">
              <Badge variant={profile?.role === "admin" ? "admin" : "default"} className="px-5 py-2.5 text-xs">
                {profile?.role || "user"}
              </Badge>
            </div>
          </div>

        </div>
      </Card>
      
    </div>
  );
}