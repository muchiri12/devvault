export default function ResourcesLoading() {
  return (
    <div className="max-w-6xl mx-auto w-full animate-pulse-slow">
      <header className="mb-10 lg:mb-12">
        <div className="h-10 w-64 bg-gray-200 dark:bg-white/5 rounded-2xl mb-3" />
        <div className="h-5 w-80 bg-gray-100 dark:bg-white/5 rounded-lg" />
      </header>

      {/* TABS SKELETON */}
      <div className="flex gap-8 border-b border-gray-200/80 dark:border-white/5 mb-10 mt-4">
        <div className="h-5 w-32 bg-gray-200 dark:bg-white/5 rounded-lg mb-4" />
        <div className="h-5 w-32 bg-gray-100 dark:bg-white/5 rounded-lg mb-4" />
      </div>

      {/* ADD RESOURCE BUTTON / FORM SKELETON */}
      <div className="mb-12 h-14 w-48 bg-gray-200 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-md" />

      {/* RESOURCE GRID SKELETON */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white dark:bg-[#0A0A0A] border border-gray-200/60 dark:border-white/5 p-8 rounded-4xl shadow-sm h-64 flex flex-col">
            <div className="h-7 w-3/4 bg-gray-200 dark:bg-white/5 rounded-xl mb-4" />
            <div className="space-y-3 mb-8">
              <div className="h-4 w-full bg-gray-100 dark:bg-white/5 rounded-lg" />
              <div className="h-4 w-full bg-gray-100 dark:bg-white/5 rounded-lg" />
              <div className="h-4 w-2/3 bg-gray-100 dark:bg-white/5 rounded-lg" />
            </div>
            <div className="mt-auto pt-6 border-t border-gray-100/80 dark:border-white/5 h-6 w-32 bg-gray-100 dark:bg-white/5 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
