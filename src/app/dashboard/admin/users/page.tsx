import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { createAdminClient } from "@/lib/supabaseAdmin";
import Link from "next/link";
import UserRow from "@/components/admin/UserRow";
import { adminService } from "@/services/adminService";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default async function AdminUsersPage() {
  const supabase = await createServerSupabaseClient();
  const supabaseAdmin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // 1. FETCH DATA VIA ADMIN SERVICE
  const users = await adminService.getAllUsers(supabase, supabaseAdmin);

  const adminCount = users.filter((u) => u.role === "admin").length;
  const userCount = users.filter((u) => u.role !== "admin").length;

  return (
    <div className="max-w-6xl mx-auto w-full pb-20 transition-colors duration-300 font-sans">
      {/* Header */}
      <header className="mb-10 flex flex-col gap-6 mt-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2 mt-4">
            <Button variant="ghost" size="sm" href="/dashboard/admin" className="!p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </Button>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Manage Users</h1>
          </div>
          <p className="text-base text-gray-500 dark:text-gray-400 font-medium">
            Edit roles, review accounts, and remove users from the platform.
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-4 shrink-0">
          <Card className="flex flex-col min-w-[100px] !p-5">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Admins</span>
            <span className="text-3xl font-extrabold text-gray-900 dark:text-white leading-none">{adminCount}</span>
          </Card>
          <Card className="flex flex-col min-w-[100px] !p-5">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Users</span>
            <span className="text-3xl font-extrabold text-gray-900 dark:text-white leading-none">{userCount}</span>
          </Card>
        </div>
      </header>

      {/* Users list */}
      {!users || users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white/50 dark:bg-white/5 rounded-[3rem] border border-gray-200/50 dark:border-white/5 shadow-sm border-dashed">
          <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-5 shadow-sm border border-gray-200/50 dark:border-white/10">
            <svg className="w-8 h-8 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">No users found</h3>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-2">Users will appear here once they sign up.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((u) => (
            <UserRow key={u.id} user={u} />
          ))}
        </div>
      )}
    </div>
  );
}