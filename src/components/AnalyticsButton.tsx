"use client";

import Link from "next/link";
import { useIsOwner } from "@/hooks/useOwner";

export default function AnalyticsButton({ profileId }: { profileId: string }) {
  const isOwner = useIsOwner(profileId);
  if (!isOwner) return null;
  return (
    <Link
      href="/dashboard/analytics"
      className="flex items-center gap-2 mt-4 px-5 py-2.5 bg-white/60 dark:bg-black/40 backdrop-blur-md border border-gray-200/50 dark:border-white/10 text-gray-900 dark:text-white font-bold rounded-2xl hover:bg-white dark:hover:bg-white/10 hover:shadow-[0_8px_16px_rgba(0,0,0,0.05)] transition-all duration-300 text-sm active:scale-95"
    >
      <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      Analytics
    </Link>
  );
}
