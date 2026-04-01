export default function DashboardLoading() {
  return (
    <div className="animate-pulse-slow">
      <header className="flex justify-between items-center mb-12 max-w-5xl">
        <div>
          <div className="h-10 w-64 bg-gray-200 dark:bg-white/5 rounded-2xl mb-3" />
          <div className="h-5 w-80 bg-gray-100 dark:bg-white/5 rounded-lg" />
        </div>
        <div className="w-14 h-14 rounded-2xl bg-gray-200 dark:bg-white/5 shadow-lg border border-gray-100 dark:border-white/10" />
      </header>

      {/* Main Content Card Skeleton */}
      <div className="w-full max-w-6xl bg-white dark:bg-[#0A0A0A] border border-gray-200/60 dark:border-white/5 rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden min-h-[500px] flex flex-col">
        <div className="border-b border-gray-100 dark:border-white/5 bg-gray-50/30 dark:bg-white/5 p-8 sm:p-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <div className="h-8 w-48 bg-gray-200 dark:bg-white/5 rounded-xl mb-3" />
            <div className="h-4 w-64 bg-gray-100 dark:bg-white/5 rounded-lg" />
          </div>
          <div className="h-10 w-44 bg-gray-200 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10" />
        </div>
        
        <div className="p-8 sm:p-10 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {/* Field 1 */}
            <div className="space-y-4">
              <div className="h-3 w-24 bg-gray-100 dark:bg-white/5 rounded-full" />
              <div className="h-[74px] w-full bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl" />
            </div>

            {/* Field 2 */}
            <div className="space-y-4">
              <div className="h-3 w-24 bg-gray-100 dark:bg-white/5 rounded-full" />
              <div className="h-[74px] w-32 bg-gray-200 dark:bg-white/5 rounded-xl" />
            </div>

            {/* Field 3 */}
            <div className="space-y-4">
              <div className="h-3 w-24 bg-gray-100 dark:bg-white/5 rounded-full" />
              <div className="h-[74px] w-full bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
