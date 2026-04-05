import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "admin";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  className = "",
}) => {
  const baseStyles = "px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest rounded-xl inline-flex items-center gap-2 border shadow-sm transition-all duration-300";
  
  const variants = {
    default: "bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10",
    success: "bg-green-50/50 dark:bg-green-900/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/30",
    warning: "bg-yellow-50/50 dark:bg-yellow-900/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900/30",
    danger: "bg-red-50/50 dark:bg-red-900/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/30",
    admin: "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-md",
  };

  const statusDots = {
    success: "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]",
    warning: "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]",
    danger: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]",
  };

  const dot = (variants as any)[variant] ? (statusDots as any)[variant] : null;

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${dot}`} />}
      {children}
    </span>
  );
};
