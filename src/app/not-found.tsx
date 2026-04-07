import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050505] text-gray-900 dark:text-white flex flex-col items-center justify-center p-6 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <div className="absolute inset-0 z-0 bg-linear-to-b from-white dark:from-[#0A0A0A] via-[#FAFAFA] dark:via-[#050505] to-[#F2F2F2] dark:to-[#000000]" />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 md:w-96 h-[250px] md:h-[350px] bg-white dark:bg-white/5 blur-[100px] rounded-full -z-0 pointer-events-none opacity-60" />

      <div className="relative z-10 max-w-md w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="w-20 h-20 bg-black dark:bg-white rounded-2xl flex items-center justify-center shadow-lg mx-auto">
          <div className="w-6 h-6 bg-white dark:bg-black rounded-sm rotate-45 transform" />
        </div>
        
        <div>
          <h1 className="text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-black via-gray-800 to-gray-600 dark:from-white dark:via-zinc-200 dark:to-zinc-600 mb-2">404</h1>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">Page not found</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">We couldn't find the page you were looking for. It might have been moved or deleted.</p>
        </div>

        <Link 
          href="/" 
          className="inline-flex h-12 items-center justify-center rounded-xl bg-black px-8 text-sm font-bold text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:focus:ring-gray-300 shadow-xl shadow-black/10 dark:shadow-white/5 active:scale-95"
        >
          Return to Hub
        </Link>
      </div>
    </div>
  );
}
