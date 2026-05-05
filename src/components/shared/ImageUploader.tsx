"use client";

import { useState } from "react";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { supabase } from "@/lib/supabaseClient";

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
  currentImage?: string;
  bucket?: string;  // defaults to "project-images"
  folder?: string;  // defaults to "project-images"
}

export default function ImageUploader({
  onUploadSuccess,
  currentImage,
  bucket = "project-images",
  folder = "project-images",
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(currentImage);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // 1. COMPRESS — shrinks files to <500 KB WebP before they hit the network
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
        fileType: "image/webp",
      };
      const compressedFile = await imageCompression(file, options);

      // 2. UNIQUE FILE NAME
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.webp`;
      const filePath = `${folder}/${fileName}`;

      // 3. UPLOAD TO SUPABASE STORAGE
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, compressedFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // 4. GET PUBLIC URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(filePath);

      setPreview(publicUrl);
      onUploadSuccess(publicUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Preview */}
      {preview && (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          <Image
            src={preview}
            alt="Project Preview"
            fill
            unoptimized
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      )}

      {/* Drop zone / Upload button */}
      <label
        className={`flex items-center justify-center w-full px-4 py-5 border-2 border-dashed rounded-2xl transition-all duration-200 group ${
          isUploading
            ? "border-gray-300 dark:border-gray-700 cursor-not-allowed opacity-60"
            : "border-gray-300 dark:border-gray-700 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50"
        }`}
      >
        <div className="flex flex-col items-center gap-1.5 text-center pointer-events-none">
          {isUploading ? (
            <>
              <svg
                className="w-6 h-6 text-gray-400 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                Compressing &amp; uploading…
              </span>
            </>
          ) : (
            <>
              <svg
                className="w-6 h-6 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                {preview ? "Replace image" : "Upload project image"}
              </span>
              <span className="text-xs text-gray-400 font-medium">
                Auto-compresses to WebP · max 500 KB
              </span>
            </>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
          disabled={isUploading}
        />
      </label>
    </div>
  );
}
