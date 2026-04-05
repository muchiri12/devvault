"use client";

import { useEffect, useState } from "react";
import SafeProjectImage from "@/components/projects/SafeProjectImage";
import { Button } from "@/components/ui/Button";

interface TrafficTableProps {
  views: any[];
}

export default function TrafficTable({ views }: TrafficTableProps) {
  const [hasConsent, setHasConsent] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // 1. Initial State
    const saved = localStorage.getItem("devvault_cookie_consent_granular");
    if (saved) {
      const parsed = JSON.parse(saved);
      setHasConsent(parsed.analytical === true);
    }

    // 2. Real-time Sync
    const handleConsent = (e: any) => {
      setHasConsent(e.detail.analytical === true);
    };

    window.addEventListener("devvault:consent-updated", handleConsent);
    return () => window.removeEventListener("devvault:consent-updated", handleConsent);
  }, []);

  const handleUnlock = () => {
    // 1. Get current consent or initialize defaults
    const saved = localStorage.getItem("devvault_cookie_consent_granular");
    const current = saved ? JSON.parse(saved) : { necessary: true, analytical: false, marketing: false };
    
    // 2. Grant Analytical access for community sharing
    const updated = { ...current, analytical: true };
    
    // 3. Persist and Sync instantly
    localStorage.setItem("devvault_cookie_consent_granular", JSON.stringify(updated));
    localStorage.setItem("devvault_cookie_consent_granular_version", "1.1"); 
    
    window.dispatchEvent(new CustomEvent("devvault:consent-updated", { detail: updated }));
  };

  return (
    <div className="relative group">
      <div className={`bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all duration-700 ${(!isMounted || !hasConsent) ? 'opacity-90 grayscale-[0.5]' : ''}`}>
        <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Traffic</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
              A log of your most recent profile visitors.
            </p>
          </div>
          {hasConsent && (
            <div className="flex flex-col items-end gap-2">
              <button 
                onClick={() => {
                  const saved = localStorage.getItem("devvault_cookie_consent_granular");
                  const updated = saved ? { ...JSON.parse(saved), analytical: false } : { necessary: true, analytical: false, marketing: false };
                  localStorage.setItem("devvault_cookie_consent_granular", JSON.stringify(updated));
                  localStorage.setItem("devvault_cookie_consent_granular_version", "1.1"); // Match CONSENT_VERSION
                  window.dispatchEvent(new CustomEvent("devvault:consent-updated", { detail: updated }));
                }}
                className="px-4 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all group/btn"
              >
                <span className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Sharing: ON
                  <span className="opacity-0 group-hover/btn:opacity-100 transition-opacity ml-1">— Go Private</span>
                </span>
              </button>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter text-right">
                You see them, they see you.
              </p>
            </div>
          )}
        </div>
        
        <div className="overflow-x-auto relative">
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
                  // If user has NO consent, we blur EVERYTHING
                  const shouldBlur = !hasConsent;

                  return (
                    <tr key={index} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0 border-l-4 border-transparent hover:border-black dark:hover:border-white">
                      <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {isMounted ? (
                          new Date(view.created_at).toLocaleString(undefined, {
                            month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                          })
                        ) : (
                          "Loading..."
                        )}
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <div className={`w-9 h-9 relative rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/10 shrink-0 transition-all duration-700 ${shouldBlur ? 'blur-lg grayscale' : ''}`}>
                            {visitorProfile?.avatar_url ? (
                              <SafeProjectImage 
                                src={visitorProfile.avatar_url} 
                                alt={visitorProfile.username} 
                                sizes="36px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-gray-400 uppercase italic">
                                {visitorProfile?.username?.charAt(0) || "G"}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col">
                            <span className={`text-sm font-bold transition-all duration-500 ${shouldBlur ? 'text-gray-300 dark:text-gray-700 blur-sm select-none' : 'text-gray-900 dark:text-white'}`}>
                              {shouldBlur ? "Developer_XXXX" : (visitorProfile ? `@${visitorProfile.username}` : "Guest Developer")}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              {visitorProfile ? (
                                <span className={`px-1.5 py-0.5 text-[8px] font-black uppercase tracking-tighter rounded-sm transition-colors ${shouldBlur ? 'bg-gray-100 dark:bg-white/5 text-gray-300' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                  Verified User
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 text-[8px] font-black uppercase tracking-tighter bg-gray-100 dark:bg-white/5 text-gray-400 rounded-sm">
                                  Public Traffic
                                </span>
                              )}
                              <span className="text-[10px] text-gray-400 font-medium">
                                • {shouldBlur ? 'XXXX.XXXX' : (view.viewer_ip === 'unknown' ? 'Direct' : 'IP Logged')}
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

      {/* COMPACT RE-ENTRY OVERLAY (Sharing Gate) */}
      {isMounted && !hasConsent && views && views.length > 0 && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/40 dark:bg-black/40 backdrop-blur-[2px] rounded-[2rem] transition-all group-hover:backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 px-6 py-8 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-white/10 text-center max-w-[280px] transform transition-transform group-hover:scale-[1.02]">
            <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-black/5">
              <svg className="w-5 h-5 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest italic mb-2">Visits Locked</h3>
            <p className="text-[10px] text-gray-400 font-bold mb-6 leading-relaxed uppercase tracking-tighter">
              Turn on sharing to see who's interested in your work.
            </p>
            <Button 
              onClick={handleUnlock}
              className="w-full py-4 rounded-xl shadow-xl shadow-black/5 font-black uppercase tracking-widest text-[9px] h-9"
            >
              See Who Viewed Me
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
