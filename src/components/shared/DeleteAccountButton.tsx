"use client";

import { useState } from "react";
import { deleteUserAccount } from "@/app/actions/deleteAccount";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import DeleteModal from "@/components/shared/DeleteModal";

export default function DeleteAccountButton() {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await deleteUserAccount();
      if (response?.success) {
        await supabase.auth.signOut();
        window.location.href = "/";
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete account. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={isDeleting}
        className={`px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2 w-fit cursor-pointer ${isDeleting
            ? "bg-red-100 dark:bg-red-900/20 text-red-400 dark:text-red-900/50 cursor-not-allowed shadow-none"
            : "bg-white dark:bg-white/5 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/30 hover:bg-red-600 dark:hover:bg-red-500 hover:text-white dark:hover:text-white hover:border-red-600 dark:hover:border-red-500 hover:shadow-md hover:shadow-red-600/20 dark:hover:shadow-red-500/10 active:scale-95 transition-all duration-300"
          }`}
      >
        {!isDeleting && (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        )}
        {isDeleting ? "Deleting Account..." : "Delete My Account"}
      </button>

      <DeleteModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  );
}
