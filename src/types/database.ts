export type UserRole = "user" | "admin";

export interface Profile {
  id: string;
  username: string | null;
  role: UserRole;
  avatar_url: string | null;
  bio: string | null;
  website: string | null;
  github: string | null;
  twitter: string | null;
  linkedin: string | null;
  password_last_changed: string | null;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  short_description: string | null;
  industry: string | null;
  role: string | null;
  duration: string | null;
  image_url: string | null;
  problem: string | null;
  process: string | null;
  solution: string | null;
  outcome: string | null;
  live_demo: string | null;
  github_repo: string | null;
  sort_order: number;
  created_at: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  created_at: string;
}

export interface Resource {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  url: string;
  status: "pending" | "approved" | "rejected";
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  target_id: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
}
