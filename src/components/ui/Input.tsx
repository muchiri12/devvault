import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 
            text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none 
            transition-all duration-300 hover:bg-white dark:hover:bg-white/8 
            focus:bg-white dark:focus:bg-white/8 focus:border-black dark:focus:border-white 
            focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10 
            shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]
            ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : ""}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-[10px] font-bold text-red-500 ml-1 uppercase tracking-wider">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 ml-1 tracking-wider">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
