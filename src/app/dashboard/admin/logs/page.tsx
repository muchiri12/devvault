import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import LogFilters from "@/components/admin/LogFilters";
import Pagination from "@/components/admin/Pagination";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function AdminLogsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const searchFilter = resolvedParams.search || "";
  const actionFilter = resolvedParams.action || "";

  // Pagination math
  const itemsPerPage = 20;
  const currentPage = parseInt(resolvedParams.page || "1", 10);
  const from = (currentPage - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  const supabase = await createServerSupabaseClient();

  // 1. Verify Admin Access
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (adminProfile?.role !== "admin") redirect("/dashboard");

  // 2. Build the Supabase query dynamically
  let query = supabase
    .from("audit_logs")
    .select("*", { count: "exact" }) // get total count for pagination
    .order("created_at", { ascending: false })
    .range(from, to);

  if (actionFilter) {
    query = query.eq("action", actionFilter);
  }

  if (searchFilter) {
    const { data: matchedProfiles } = await supabase
      .from("profiles")
      .select("id")
      .ilike("username", `%${searchFilter}%`);

    const matchedIds = matchedProfiles?.map((p) => p.id) || [];

    if (matchedIds.length > 0) {
      query = query.in("user_id", matchedIds);
    } else {
      // No users matched — force empty result
      query = query.eq("id", "00000000-0000-0000-0000-000000000000");
    }
  }

  const { data: logs, count } = await query;

  const totalPages = count ? Math.ceil(count / itemsPerPage) : 1;

  // 3. Batch-fetch usernames for all unique actor/target IDs
  const uniqueUserIds = Array.from(
    new Set(
      (logs || [])
        .flatMap((log) => [log.user_id, log.target_id])
        .filter(Boolean)
    )
  );

  let profileMap: Record<string, string> = {};
  if (uniqueUserIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username")
      .in("id", uniqueUserIds);

    profileMap =
      profiles?.reduce(
        (acc, profile) => {
          acc[profile.id] = profile.username;
          return acc;
        },
        {} as Record<string, string>
      ) || {};
  }

  // Helper: action badge
  const renderActionBadge = (action: string) => {
    switch (action) {
      case "user.role.updated":
        return (
          <span className="px-2.5 py-1 text-xs font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-md uppercase tracking-wider">
            Role Updated
          </span>
        );
      case "user.deleted":
        return (
          <span className="px-2.5 py-1 text-xs font-bold bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-md uppercase tracking-wider">
            User Deleted
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-bold bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-md uppercase tracking-wider">
            {action}
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full pb-20 transition-colors duration-300">
      {/* Header */}
      <header className="mb-12 mt-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Audit Logs
        </h1>
        <p className="text-base text-gray-500 dark:text-gray-400 mt-2 font-medium">
          Record of all administrative actions.
        </p>
      </header>

      {/* Filter Bar */}
      <LogFilters />

      {/* Table container */}
      <div className="bg-white dark:bg-[#0A0A0A] border border-gray-200/60 dark:border-white/5 rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-colors flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/2 border-b border-gray-100 dark:border-white/5">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Admin (Actor)
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Target User
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Metadata
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {!logs || logs.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-16 text-center text-gray-500 dark:text-gray-400 font-medium"
                  >
                    {searchFilter || actionFilter
                      ? "No logs match your current filters."
                      : "No administrative actions recorded yet."}
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors"
                  >
                    {/* TIMESTAMP */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {new Date(log.created_at).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>

                    {/* ACTOR */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.user_id ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 shrink-0">
                            {profileMap[log.user_id]?.charAt(0).toUpperCase() ||
                              "?"}
                          </div>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            @{profileMap[log.user_id] || "Unknown"}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">
                          System
                        </span>
                      )}
                    </td>

                    {/* ACTION BADGE */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderActionBadge(log.action)}
                    </td>

                    {/* TARGET USER */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.target_id ? (
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          @{profileMap[log.target_id] || "Deleted User"}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>

                    {/* METADATA (Beautifully Parsed) */}
                    <td className="px-6 py-4">
                      {log.metadata ? (
                        <div className="flex flex-col gap-1.5 min-w-50">

                          {/* Role chip */}
                          {log.metadata.new_role && (
                            <div className="text-xs text-gray-600 dark:text-gray-300">
                              <span className="font-bold text-gray-400 dark:text-gray-500 mr-1">Role:</span>
                              {log.metadata.new_role}
                            </div>
                          )}

                          {/* IP Address */}
                          {log.metadata.ip_address && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-50 dark:bg-white/5 w-fit px-2 py-0.5 rounded border border-gray-100 dark:border-white/5">
                              <svg className="w-3 h-3 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                              </svg>
                              {log.metadata.ip_address}
                            </div>
                          )}

                          {/* Browser (truncated) */}
                          {log.metadata.browser && (
                            <div
                              className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5 w-fit px-2 py-0.5 rounded border border-gray-100 dark:border-white/5 max-w-55"
                              title={log.metadata.browser}
                            >
                              <svg className="w-3 h-3 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span className="truncate">{log.metadata.browser.split(" ")[0]}...</span>
                            </div>
                          )}

                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
}
