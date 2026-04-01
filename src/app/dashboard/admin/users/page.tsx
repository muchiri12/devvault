import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { createAdminClient } from "@/lib/supabaseAdmin";
import { redirect } from "next/navigation";
import Link from "next/link";
import UserRow from "@/components/admin/UserRow";

export default async function AdminUsersPage() {
  const supabase = await createServerSupabaseClient();

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Role check
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");

  // Fetch profiles (no email column — email is in auth.users)
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, username, role, avatar_url, created_at")
    .order("created_at", { ascending: false });

  // Fetch emails from auth.users via admin client
  const supabaseAdmin = createAdminClient();
  const { data: authData } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
  const emailMap = new Map(authData?.users?.map((u) => [u.id, u.email]) ?? []);

  // Merge email into each profile
  const users = profiles?.map((p) => ({
    ...p,
    email: emailMap.get(p.id) ?? undefined,
  }));

  const adminCount = users?.filter((u) => u.role === "admin").length ?? 0;
  const userCount = users?.filter((u) => u.role !== "admin").length ?? 0;

  return (
    <div className="max-w-6xl mx-auto w-full pb-20 transition-colors duration-300">
      {/* Header */}
      <header className="mb-10 flex flex-col gap-4 mt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1 mt-4">
            <Link
              href="/dashboard/admin"
              className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Back to admin panel"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Manage Users</h1>
          </div>
          <p className="text-base text-gray-500 dark:text-gray-400 mt-2 font-medium">
            Edit roles, review accounts, and remove users from the platform.
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-3 sm:gap-4 shrink-0">
          <div className="bg-white dark:bg-[#0A0A0A] p-4 sm:p-5 rounded-2xl border border-gray-200/60 dark:border-white/5 shadow-sm flex flex-col min-w-[76px] sm:min-w-[90px] transition-colors duration-300">
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Admins</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">{adminCount}</span>
          </div>
          <div className="bg-white dark:bg-[#0A0A0A] p-4 sm:p-5 rounded-2xl border border-gray-200/60 dark:border-white/5 shadow-sm flex flex-col min-w-[76px] sm:min-w-[90px] transition-colors duration-300">
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Users</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">{userCount}</span>
          </div>
        </div>
      </header>

      {/* Users list */}
      {error ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white/50 dark:bg-white/5 rounded-4xl border border-gray-200/50 dark:border-white/5 shadow-sm transition-colors duration-300">
          <p className="text-red-500 font-medium">Failed to load users: {error.message}</p>
        </div>
      ) : !users || users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white/50 dark:bg-white/5 rounded-4xl border border-gray-200/50 dark:border-white/5 shadow-sm transition-colors duration-300">
          <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-5 shadow-sm">
            <svg className="w-8 h-8 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">No users found</h3>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-2">Users will appear here once they sign up.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <UserRow key={u.id} user={u} />
          ))}
        </div>
      )}
    </div>
  );
}