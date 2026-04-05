import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  border?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hover = true,
  border = true,
}) => {
  return (
    <div
      className={`
        bg-white dark:bg-[#0A0A0A] rounded-[2.5rem] p-8 md:p-10 
        ${border ? "border border-gray-200/60 dark:border-white/5" : ""}
        ${hover ? "hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] dark:hover:shadow-[0_12px_40px_rgba(255,255,255,0.02)] hover:-translate-y-1 transition-all duration-300" : ""}
        shadow-[0_4px_20px_rgb(0,0,0,0.02)]
        ${className}
      `}
    >
      {children}
    </div>
  );
};
