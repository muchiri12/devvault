"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In a real prod app, you might log this to Sentry
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050505] text-gray-900 dark:text-white flex flex-col items-center justify-center p-6 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <div className="absolute inset-0 z-0 bg-linear-to-b from-white dark:from-[#0A0A0A] via-[#FAFAFA] dark:via-[#050505] to-[#F2F2F2] dark:to-[#000000]" />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 md:w-96 h-[250px] md:h-[350px] bg-red-500/10 dark:bg-red-500/5 blur-[100px] rounded-full -z-0 pointer-events-none opacity-60" />

      <div className="relative z-10 max-w-md w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center shadow-lg mx-auto border border-red-200 dark:border-red-900/50">
          <svg className="w-8 h-8 text-red-600 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white mb-3">Something broke.</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">An unexpected error occurred. Our servers have logged the issue and we are looking into it.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button onClick={reset} className="w-full sm:w-auto h-12 px-8">
            Try again
          </Button>
          <Button variant="secondary" href="/dashboard" className="w-full sm:w-auto h-12 px-8">
            Return to Dashboard
          </Button>
        </div>

        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl text-left overflow-auto max-h-48 text-xs font-mono text-red-800 dark:text-red-400">
            {error.message}
          </div>
        )}
      </div>
    </div>
  );
}
