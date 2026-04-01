"use client";

import { useState } from "react";
import { updateUserRole, adminDeleteUser } from "@/app/actions/adminUserActions";
import { toast } from "sonner";

interface UserRowProps {
  user: {
    id: string;
    email?: string;
    username?: string;
    role?: string;
    created_at?: string;
    avatar_url?: string;
  };
}

export default function UserRow({ user }: UserRowProps) {
  const [loading, setLoading] = useState(false);

  const handleRoleChange = async () => {
    setLoading(true);
    const newRole = user.role === "admin" ? "user" : "admin";
    const res = await updateUserRole(user.id, newRole);
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success(`Role changed to ${newRole}`);
      location.reload();
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    const confirmed = confirm(
      `Are you sure you want to permanently delete "${user.username || user.email}"? This cannot be undone.`
    );
    if (!confirmed) return;
    setLoading(true);
    const res = await adminDeleteUser(user.id);
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("User deleted successfully");
      location.reload();
    }
    setLoading(false);
  };

  const isAdmin = user.role === "admin";
  const initials = (user.username?.[0] || user.email?.[0] || "?").toUpperCase();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-white dark:bg-[#0A0A0A] border border-gray-200/60 dark:border-white/5 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_12px_40px_rgba(255,255,255,0.02)] hover:-translate-y-0.5 transition-all duration-300">

      {/* User info */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        {/* Avatar */}
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-700 dark:text-gray-300 font-extrabold text-sm uppercase overflow-hidden shrink-0 border border-gray-200/60 dark:border-white/10 shadow-sm transition-colors duration-300">
          {user.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatar_url} alt={user.username || "avatar"} className="w-full h-full object-cover" />
          ) : (
            initials
          )}
        </div>

        <div className="min-w-0">
          <p className="font-extrabold text-gray-900 dark:text-white text-sm tracking-tight truncate">
            {user.username ? `@${user.username}` : <span className="text-gray-400 dark:text-gray-600 italic font-medium">no username</span>}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium mt-0.5 truncate">{user.email || user.id}</p>
        </div>
      </div>

      {/* Role badge*/}
      <div className="flex items-center flex-wrap gap-2 shrink-0">
        {/* Role badge */}
        <span
          className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
            isAdmin
              ? "bg-black dark:bg-white text-white dark:text-black shadow-sm"
              : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400"
          }`}
        >
          {user.role || "user"}
        </span>

        {/* Toggle role */}
        <button
          onClick={handleRoleChange}
          disabled={loading}
          className="px-3 sm:px-4 py-2 text-xs font-bold bg-white dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm cursor-pointer"
        >
          {isAdmin ? "Demote" : "Make Admin"}
        </button>

        {/* Delete user */}
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-3 sm:px-4 py-2 text-xs font-bold bg-white dark:bg-white/5 border border-red-200 dark:border-red-900/30 text-red-500 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm cursor-pointer"
        >
          {loading ? "Working…" : "Delete"}
        </button>
      </div>
    </div>
  );
}
