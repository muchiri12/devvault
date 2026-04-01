export default function SingleProjectLoading() {
  return (
    <div className="max-w-5xl mx-auto w-full animate-pulse-slow py-4 sm:py-8">
      
      {/* TOP NAVIGATION & ACTIONS SKELETON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        {/* Back Button Placeholder */}
        <div className="h-10 w-32 bg-gray-200 rounded-xl" /> 
        
        {/* Action Buttons (Edit / Delete) Placeholder */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-24 bg-gray-200 rounded-xl" />
          <div className="h-10 w-24 bg-red-100/50 rounded-xl" />
        </div>
      </div>

      {/* HEADER SKELETON */}
      <div className="mb-10">
        {/* Industry Tag */}
        <div className="h-6 w-24 bg-blue-50 rounded-md mb-5" /> 
        
        {/* Big Title */}
        <div className="h-10 sm:h-14 w-full max-w-2xl bg-gray-200 rounded-2xl mb-6" /> 
        
        {/* External Links (Live Demo / Repo) */}
        <div className="flex gap-4">
           <div className="h-6 w-32 bg-gray-100 rounded-lg" />
           <div className="h-6 w-32 bg-gray-100 rounded-lg" />
        </div>
      </div>

      {/* HERO IMAGE SKELETON */}
      <div className="w-full aspect-video bg-gray-200 rounded-4xl mb-12 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]" />

      {/* LONG DESCRIPTION SKELETON */}
      <div className="space-y-4 mb-16 max-w-3xl">
        <div className="h-5 w-full bg-gray-100 rounded-lg" />
        <div className="h-5 w-full bg-gray-100 rounded-lg" />
        <div className="h-5 w-11/12 bg-gray-100 rounded-lg" />
        <div className="h-5 w-4/6 bg-gray-100 rounded-lg" />
        <div className="h-5 w-5/6 bg-gray-100 rounded-lg" />
      </div>

      {/* GALLERY SKELETON */}
      <div className="border-t border-gray-100 pt-12">
        <div className="h-8 w-48 bg-gray-200 rounded-xl mb-8" /> 
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-full aspect-video bg-gray-200 rounded-3xl" />
          ))}
        </div>
      </div>
      
    </div>
  );
}