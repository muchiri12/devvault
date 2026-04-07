"use client";

import { Card } from "@/components/ui/Card";

export default function AdminLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      
      {/* Admin Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-white/5 pb-6">
        <div className="space-y-3">
          <div className="h-4 w-24 bg-red-100 dark:bg-red-900/30 rounded-full animate-pulse" />
          <div className="h-8 w-64 bg-gray-200 dark:bg-white/10 rounded-xl animate-pulse" />
          <div className="h-4 w-96 bg-gray-100 dark:bg-white/5 rounded-md animate-pulse" />
        </div>
      </div>

      {/* Admin Quick Stats Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 sm:p-5 bg-white dark:bg-[#0A0A0A] border border-gray-100 dark:border-white/5 rounded-2xl shadow-sm">
            <div className="h-3 w-16 bg-gray-100 dark:bg-white/5 rounded-md animate-pulse mb-3" />
            <div className="h-8 w-20 bg-gray-200 dark:bg-white/10 rounded-xl animate-pulse" />
          </div>
        ))}
      </div>

      {/* Admin Data Table Skeleton */}
      <Card className="overflow-hidden bg-white dark:bg-[#0A0A0A] border border-gray-100 dark:border-white/5">
        <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-white/5">
          <div className="h-6 w-32 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse" />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <th key={i} className="px-6 py-4">
                    <div className="h-3 w-20 bg-gray-200 dark:bg-white/10 rounded-md animate-pulse" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((rowIndex) => (
                <tr key={rowIndex} className="border-b border-gray-50 dark:border-white/5 last:border-0">
                  {/* Avatar + Primary ID column */}
                  <td className="px-6 py-5 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-white/5 animate-pulse shrink-0" />
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-gray-200 dark:bg-white/10 rounded-md animate-pulse" />
                      <div className="h-3 w-32 bg-gray-100 dark:bg-white/5 rounded-md animate-pulse" />
                    </div>
                  </td>
                  {/* Status pills or plain dates */}
                  {[1, 2, 3, 4].map((colIndex) => (
                    <td key={colIndex} className="px-6 py-5">
                      <div className={`h-4 rounded-md animate-pulse ${colIndex === 1 ? 'w-16 bg-gray-100 dark:bg-white/5 rounded-full' : 'w-24 bg-gray-100 dark:bg-white/5'}`} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
