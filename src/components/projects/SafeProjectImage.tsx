"use client";

import Image from "next/image";
import { useState } from "react";

interface SafeProjectImageProps {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
}

/**
 * Wraps Next.js <Image> with an onError fallback.
 * If the image URL is broken (e.g. duplicated path, 400 from optimizer),
 * it silently renders the "No Image" placeholder instead.
 */
export default function SafeProjectImage({
  src,
  alt,
  sizes = "(max-width:768px) 100vw, 33vw",
  className = "object-cover",
  priority = false,
}: SafeProjectImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-white/5 dark:to-transparent border border-gray-100/50 dark:border-white/5 shadow-inner">
        <svg
          className="w-10 h-10 text-gray-300 dark:text-gray-700 mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">
          No Image
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
