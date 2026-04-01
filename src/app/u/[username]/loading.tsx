export default function PublicProfileLoading() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050505] animate-pulse-slow">
      {/* HEADER / HERO SKELETON */}
      <div className="relative pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          {/* Avatar Skeleton */}
          <div className="w-32 h-32 rounded-[2.5rem] bg-gray-200 dark:bg-white/5 shadow-xl border-4 border-white dark:border-[#050505] mb-8" />
          
          {/* Name & Username Skeleton */}
          <div className="h-10 w-64 bg-gray-200 dark:bg-white/5 rounded-2xl mb-4" />
          <div className="h-6 w-40 bg-gray-100 dark:bg-white/5 rounded-xl mb-8" />
          
          {/* Bio Skeleton */}
          <div className="max-w-2xl w-full space-y-3 mb-10">
            <div className="h-5 w-full bg-gray-100 dark:bg-white/5 rounded-lg" />
            <div className="h-5 w-11/12 bg-gray-100 dark:bg-white/5 rounded-lg mx-auto" />
          </div>

          {/* Social Links Skeleton */}
          <div className="flex gap-4 mb-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10" />
            ))}
          </div>
        </div>
      </div>

      {/* PROJECTS SECTION SKELETON */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="flex items-center justify-between mb-12">
           <div className="h-8 w-48 bg-gray-200 dark:bg-white/5 rounded-xl" />
           <div className="h-px flex-1 bg-gray-100 dark:bg-white/5 mx-8" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col h-full bg-white dark:bg-[#0A0A0A] rounded-4xl border border-gray-200/60 dark:border-white/5 shadow-sm overflow-hidden h-[450px]">
              <div className="relative w-full h-52 bg-gray-50 dark:bg-white/5 border-b border-gray-100/80 dark:border-white/5" />
              <div className="p-8 flex flex-col grow">
                <div className="h-7 w-3/4 bg-gray-200 dark:bg-white/5 rounded-xl mb-4" />
                <div className="space-y-3 mb-8">
                  <div className="h-4 w-full bg-gray-100 dark:bg-white/5 rounded-lg" />
                  <div className="h-4 w-full bg-gray-100 dark:bg-white/5 rounded-lg" />
                </div>
                <div className="mt-auto pt-6 border-t border-gray-100/80 dark:border-white/5 h-6 w-32 bg-gray-100 dark:bg-white/5 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}