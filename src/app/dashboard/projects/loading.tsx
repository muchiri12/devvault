export default function ProjectsLoading() {
  return (
    <div className="max-w-6xl mx-auto w-full animate-pulse-slow">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="h-10 w-48 bg-gray-200 dark:bg-white/5 rounded-2xl mb-3" />
          <div className="h-5 w-80 bg-gray-100 dark:bg-white/5 rounded-lg" />
        </div>

        <div className="h-14 w-40 bg-gray-200 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10" />
      </header>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[1, 2].map((i) => (
          <div key={i} className="p-5 bg-white dark:bg-[#0A0A0A] rounded-2xl border border-gray-200/60 dark:border-white/5 shadow-sm h-28">
            <div className="h-3 w-20 bg-gray-100 dark:bg-white/5 rounded-full mb-3" />
            <div className="h-9 w-12 bg-gray-200 dark:bg-white/5 rounded-xl" />
          </div>
        ))}
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-8 border-b border-gray-200/80 dark:border-white/5 mb-10 mt-4">
        <div className="h-5 w-32 bg-gray-200 dark:bg-white/5 rounded-lg mb-4" />
        <div className="h-5 w-32 bg-gray-100 dark:bg-white/5 rounded-lg mb-4" />
      </div>

      {/* Project Grid Skeleton */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex flex-col h-full bg-white dark:bg-[#0A0A0A] rounded-4xl border border-gray-200/60 dark:border-white/5 shadow-sm overflow-hidden h-[450px]">
            <div className="relative w-full h-52 bg-gray-50 dark:bg-white/5 border-b border-gray-100/80 dark:border-white/5" />
            <div className="p-8 flex flex-col grow">
              <div className="h-7 w-3/4 bg-gray-200 dark:bg-white/5 rounded-xl mb-4" />
              <div className="space-y-3 mb-8">
                <div className="h-4 w-full bg-gray-100 dark:bg-white/5 rounded-lg" />
                <div className="h-4 w-full bg-gray-100 dark:bg-white/5 rounded-lg" />
                <div className="h-4 w-2/3 bg-gray-100 dark:bg-white/5 rounded-lg" />
              </div>
              <div className="mt-auto pt-6 border-t border-gray-100/80 dark:border-white/5 h-6 w-32 bg-gray-100 dark:bg-white/5 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}