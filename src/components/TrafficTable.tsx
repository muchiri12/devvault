"use client";

import { useState } from "react";
import SafeProjectImage from "@/components/SafeProjectImage";

interface TrafficTableProps {
  views: any[];
}

export default function TrafficTable({ views }: TrafficTableProps) {
  const [showIdentities, setShowIdentities] = useState(true);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-colors">
      <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Traffic</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium italic">
            {showIdentities ? "A log of your most recent profile visitors." : "Privacy Mode is ON — Names and avatars are hidden."}
          </p>
        </div>
        
        <button
          onClick={() => setShowIdentities(!showIdentities)}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl border transition-all ${
            showIdentities 
              ? "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400 hover:text-black dark:hover:text-white" 
              : "bg-black dark:bg-white border-black dark:border-white text-white dark:text-black shadow-lg"
          }`}
        >
          {showIdentities ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
              Go Private
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              Show Names
            </>
          )}
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
              <th className="px-8 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date &amp; Time</th>
              <th className="px-8 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Visitor Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {(!views || views.length === 0) ? (
              <tr>
                <td colSpan={2} className="px-8 py-12 text-center text-gray-500 dark:text-gray-400 font-medium">
                  No views yet. Share your profile link to get started!
                </td>
              </tr>
            ) : (
              views.map((view: any, index: number) => {
                const visitorProfile = view.profiles;
                return (
                  <tr key={index} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {new Date(view.created_at).toLocaleString(undefined, {
                        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className={`w-8 h-8 relative rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/10 shrink-0 transition-all duration-500 ${!showIdentities ? 'blur-md bg-gray-200 dark:bg-zinc-800' : ''}`}>
                          {showIdentities && visitorProfile?.avatar_url ? (
                            <SafeProjectImage 
                              src={visitorProfile.avatar_url} 
                              alt={visitorProfile.username} 
                              sizes="32px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-gray-400 uppercase italic">
                              {showIdentities ? (visitorProfile?.username?.charAt(0) || "G") : "?"}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col">
                          <span className={`text-sm font-bold transition-all duration-300 ${!showIdentities ? 'text-gray-300 dark:text-gray-700 blur-[2px]' : 'text-gray-900 dark:text-white'}`}>
                            {!showIdentities ? "Developer_XXXX" : (visitorProfile ? `@${visitorProfile.username}` : "Guest Developer")}
                          </span>
                          <div className="flex items-center gap-2 mt-0.5">
                            {visitorProfile ? (
                              <span className={`px-1.5 py-0.5 text-[8px] font-black uppercase tracking-tighter rounded-sm transition-colors ${!showIdentities ? 'bg-gray-100 dark:bg-white/5 text-gray-300' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                Verified User
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 text-[8px] font-black uppercase tracking-tighter bg-gray-100 dark:bg-white/5 text-gray-400 rounded-sm">
                                Public Traffic
                              </span>
                            )}
                            <span className="text-[10px] text-gray-400 font-medium">
                              • {view.viewer_ip === 'unknown' ? 'Direct' : (showIdentities ? 'IP Logged' : 'XXXX.XXXX')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
