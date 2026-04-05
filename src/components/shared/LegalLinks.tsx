"use client";

import Link from "next/link";

export function LegalLinks({ 
  justify = "center", 
  direction = "row" 
}: { 
  justify?: "center" | "start" | "between",
  direction?: "row" | "column"
}) {
  const handleOpenPrivacy = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("devvault:open-privacy"));
  };

  const justifyClass = justify === "center" ? "justify-center" : justify === "start" ? "justify-start" : "justify-between";
  const directionClass = direction === "row" ? "flex-col sm:flex-row items-center gap-6 sm:gap-12" : "flex-col items-start gap-3";

  return (
    <div className={`flex ${directionClass} ${justifyClass} text-zinc-600 dark:text-zinc-400 text-[10px] font-bold tracking-widest uppercase whitespace-nowrap`}>
      <span className="opacity-70">© {new Date().getFullYear()} DevVault</span>
      <Link href="/privacy" className="hover:text-black dark:hover:text-white transition-colors duration-300">
        Privacy Policy
      </Link>
      <button 
        onClick={handleOpenPrivacy}
        className="hover:text-black dark:hover:text-white transition-colors duration-300 cursor-pointer uppercase text-left"
      >
        Privacy Settings
      </button>
      <a href="#" className="hover:text-black dark:hover:text-white transition-colors duration-300">
        Terms of Service
      </a>
    </div>
  );
}
