import { createServerSupabaseClient } from "@/lib/supabaseServer";
import LogFilters from "@/components/admin/LogFilters";
import Pagination from "@/components/admin/Pagination";
import { adminService } from "@/services/adminService";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function AdminLogsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const searchFilter = resolvedParams.search || "";
  const actionFilter = resolvedParams.action || "";
  const currentPage = parseInt(resolvedParams.page || "1", 10);

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // 1. FETCH LOGS VIA SERVICE
  const { logs, totalPages, profileMap } = await adminService.getAuditLogs(supabase, {
    page: currentPage,
    action: actionFilter,
    search: searchFilter
  });

  // Helper: action badge
  const renderActionBadge = (action: string) => {
    switch (action) {
      case "user.role.updated":
        return <Badge variant="admin">Role Updated</Badge>;
      case "user.deleted":
        return <Badge variant="danger">User Deleted</Badge>;
      default:
        return <Badge variant="default">{action}</Badge>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full pb-20 transition-colors duration-300 font-sans">
      {/* Header */}
      <header className="mb-10 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Button variant="ghost" size="sm" href="/dashboard/admin" className="!p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </Button>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Audit Logs</h1>
          </div>
          <p className="text-base text-gray-500 dark:text-gray-400 font-medium">Record of all administrative actions.</p>
        </div>
      </header>

      {/* Filter Bar */}
      <LogFilters />

      {/* Table container */}
      <Card className="!p-0 overflow-hidden border-dashed">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Timestamp</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Admin (Actor)</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Action</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Target User</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5 font-medium">
              {!logs || logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-gray-400 dark:text-gray-500 italic">
                    {searchFilter || actionFilter ? "No logs match your current filters." : "No administrative actions recorded yet."}
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/30 dark:hover:bg-white/2 transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(log.created_at).toLocaleString(undefined, {
                        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </td>

                    <td className="px-6 py-5 whitespace-nowrap">
                      {log.user_id ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300 shrink-0">
                            {profileMap[log.user_id]?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">@{profileMap[log.user_id] || "Unknown"}</span>
                        </div>
                      ) : (
                        <Badge variant="default" className="opacity-50">System</Badge>
                      )}
                    </td>

                    <td className="px-6 py-5 whitespace-nowrap">{renderActionBadge(log.action)}</td>

                    <td className="px-6 py-5 whitespace-nowrap">
                      {log.target_id ? (
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">@{profileMap[log.target_id] || "Deleted User"}</span>
                      ) : (
                        <span className="text-gray-300 dark:text-gray-600">—</span>
                      )}
                    </td>

                    <td className="px-6 py-5">
                      {log.metadata ? (
                        <div className="flex flex-col gap-2 min-w-50">
                          {log.metadata.new_role && (
                            <div className="text-[10px] text-gray-600 dark:text-gray-400 flex items-center gap-1.5 uppercase tracking-widest">
                              <span className="font-extrabold opacity-50">Role:</span>
                              <span className="font-extrabold text-black dark:text-white">{log.metadata.new_role}</span>
                            </div>
                          )}
                          {log.metadata.ip_address && (
                            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-500 bg-gray-50/50 dark:bg-white/5 w-fit px-2 py-0.5 rounded border border-gray-100 dark:border-white/5">
                              <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                              {log.metadata.ip_address}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-300 dark:text-gray-600">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </Card>
    </div>
  );
}
