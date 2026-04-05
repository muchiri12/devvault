import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { adminService } from "@/services/adminService";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { approveResource, rejectResource } from "@/app/actions/adminResourceActions";

export const dynamic = "force-dynamic";

export default async function AdminResourcesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // 1. FETCH DATA VIA SERVICE
  const pendingResources = await adminService.getPendingResources(supabase);

  return (
    <div className="max-w-6xl mx-auto w-full pb-20 transition-colors duration-300 font-sans">
      
      {/* Header */}
      <header className="mb-12 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Button variant="ghost" size="sm" href="/dashboard/admin" className="!p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </Button>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Resource Approvals</h1>
          </div>
          <p className="text-base text-gray-500 dark:text-gray-400 font-medium">Review and manage community submissions.</p>
        </div>
        <Badge variant="admin">Admin Mode</Badge>
      </header>

      {/* PENDING RESOURCES GRID */}
      {!pendingResources || pendingResources.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white/50 dark:bg-white/5 rounded-[3rem] border border-gray-200/50 dark:border-white/10 border-dashed shadow-sm transition-colors duration-300">
          <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-5 shadow-sm border border-gray-200/50 dark:border-white/10">
            <svg className="w-8 h-8 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">All Caught Up!</h3>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-2">No new resources waiting for approval right now.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {pendingResources.map((resource) => (
            <Card key={resource.id} className="flex flex-col h-full !p-8 hover:-translate-y-1 group">
              <h3 className="font-extrabold text-xl text-gray-900 dark:text-white mb-3 truncate leading-tight transition-colors">
                {resource.title}
              </h3>
              
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed line-clamp-3">
                {resource.description}
              </p>

              <div className="mt-auto space-y-8">
                <Button 
                  variant="secondary" 
                  href={resource.url} 
                  target="_blank" 
                  className="w-full !justify-start !p-0 border-none bg-transparent dark:bg-transparent shadow-none hover:!bg-transparent group-hover:text-black dark:group-hover:text-white"
                  icon={<svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>}
                >
                  Visit Resource
                </Button>

                <div className="flex gap-3 bg-gray-50/50 dark:bg-white/5 -mx-8 -mb-8 p-6 px-8 rounded-b-[2rem] border-t border-gray-100/80 dark:border-white/5">
                  <form action={approveResource} className="flex-1">
                    <input type="hidden" name="id" value={resource.id} />
                    <Button type="submit" variant="primary" className="w-full !p-3" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>}>
                      Approve
                    </Button>
                  </form>

                  <form action={rejectResource} className="flex-1">
                    <input type="hidden" name="id" value={resource.id} />
                    <Button type="submit" variant="danger" className="w-full !p-3" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>}>
                      Reject
                    </Button>
                  </form>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}