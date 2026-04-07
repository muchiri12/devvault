import { Card } from "@/components/ui/Card";

export default function ExploreLoading() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050505] transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 md:py-12 animate-in fade-in duration-700">
        
        {/* Header Skeleton */}
        <div className="max-w-2xl mb-12 md:mb-16">
          <div className="h-6 w-32 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse mb-6" />
          <div className="h-10 w-3/4 sm:w-96 bg-gray-200 dark:bg-white/10 rounded-2xl animate-pulse mb-6" />
          <div className="h-4 w-full sm:w-[500px] bg-gray-100 dark:bg-white/5 rounded-md animate-pulse mb-2" />
          <div className="h-4 w-2/3 sm:w-[400px] bg-gray-100 dark:bg-white/5 rounded-md animate-pulse" />
        </div>

        {/* Project Grid Skeleton Array */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i} className="group relative flex flex-col h-[320px] overflow-hidden overflow-visible!">
              
              {/* Image Skeleton */}
              <div className="w-full h-40 bg-gray-100 dark:bg-white/5 animate-pulse rounded-t-3xl border-b border-gray-100 dark:border-white/5" />
              
              <div className="p-5 flex flex-col flex-1 relative z-10 bg-white dark:bg-[#0A0A0A] rounded-b-3xl">
                
                {/* Title & Author */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-3/4 bg-gray-200 dark:bg-white/10 rounded-md animate-pulse" />
                    <div className="h-3 w-1/2 bg-gray-100 dark:bg-white/5 rounded-md animate-pulse" />
                  </div>
                  {/* Category Pill Skeleton */}
                  <div className="h-6 w-16 bg-gray-100 dark:bg-white/5 rounded-full animate-pulse" />
                </div>
                
                {/* Description Skeleton */}
                <div className="space-y-2 mt-2">
                  <div className="h-3 w-full bg-gray-100 dark:bg-white/5 rounded-md animate-pulse" />
                  <div className="h-3 w-4/5 bg-gray-100 dark:bg-white/5 rounded-md animate-pulse" />
                </div>

                {/* Footer Metrics */}
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5 flex gap-4">
                  <div className="h-4 w-12 bg-gray-100 dark:bg-white/5 rounded-md animate-pulse" />
                  <div className="h-4 w-12 bg-gray-100 dark:bg-white/5 rounded-md animate-pulse" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
