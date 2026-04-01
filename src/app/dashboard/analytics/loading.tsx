export default function AnalyticsLoading() {
  return (
    <div className="p-8 max-w-6xl mx-auto animate-pulse-slow">
      
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="h-10 w-48 bg-gray-200 dark:bg-white/5 rounded-2xl mb-3" />
          <div className="h-5 w-80 bg-gray-100 dark:bg-white/5 rounded-lg" />
        </div>
        <div className="h-10 w-44 bg-gray-200 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10" />
      </div>

      {/* STAT CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-white/5 p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-44">
            <div className="h-4 w-24 bg-gray-100 dark:bg-white/5 rounded-full mb-4" />
            <div className="h-12 w-20 bg-gray-200 dark:bg-white/5 rounded-2xl" />
          </div>
        ))}
      </div>

      {/* RECENT ACTIVITY LOG SKELETON */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-white/5 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="p-8 border-b border-gray-100 dark:border-gray-800">
          <div className="h-7 w-40 bg-gray-200 dark:bg-white/5 rounded-xl mb-2" />
          <div className="h-4 w-64 bg-gray-100 dark:bg-white/5 rounded-lg" />
        </div>
        
        <div className="p-8">
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-white/5 last:border-0">
                <div className="h-5 w-40 bg-gray-100 dark:bg-white/5 rounded-lg" />
                <div className="h-6 w-32 bg-gray-50 dark:bg-white/5 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
