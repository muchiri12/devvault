"use client";

import { useState } from "react";
import { updateUserRole, adminDeleteUser } from "@/app/actions/adminUserActions";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

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
      // In a real production app, we would use router.refresh() 
      // but location.reload() is robust for a total state clear.
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
    <Card className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-300 bg-white dark:bg-[#0A0A0A]">
      {/* User info */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-700 dark:text-gray-300 font-extrabold text-sm uppercase overflow-hidden shrink-0 border border-gray-200/60 dark:border-white/10 shadow-sm transition-colors duration-300">
          {user.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatar_url} alt={user.username || "avatar"} className="w-full h-full object-cover" />
          ) : (
            initials
          )}
        </div>

        <div className="min-w-0">
          <p className="font-extrabold text-gray-900 dark:text-white text-base tracking-tight truncate leading-tight">
            {user.username ? `@${user.username}` : <span className="text-gray-400 dark:text-gray-600 italic font-medium">no username</span>}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium mt-1 truncate">{user.email || user.id}</p>
        </div>
      </div>

      {/* Role & Actions */}
      <div className="flex items-center flex-wrap gap-3 shrink-0">
        <Badge variant={isAdmin ? "admin" : "default"} className="px-4 py-1.5 rounded-xl">
          {user.role || "user"}
        </Badge>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRoleChange}
            disabled={loading}
            className="rounded-xl font-extrabold text-[10px] uppercase tracking-widest px-4"
          >
            {isAdmin ? "Demote" : "Promote"}
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            disabled={loading}
            className="rounded-xl font-extrabold text-[10px] uppercase tracking-widest px-4"
          >
            {loading ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
