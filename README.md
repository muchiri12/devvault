# DevVault

A full-stack developer portfolio and resource management platform built with **Next.js 15 (App Router)** and **Supabase**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Server Components) |
| Auth + DB | Supabase (PostgreSQL + Auth) |
| Storage | Supabase Storage |
| Styling | Tailwind CSS v4 |
| UI | Sonner (toasts), next/image, next/font (Geist) |
| Language | TypeScript |

---

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout — Geist font, Sonner toaster
│   ├── page.tsx                # Landing page (hero, features, footer CTA)
│   │
│   ├── login/page.tsx          # Login form
│   ├── register/page.tsx       # Registration form (creates profile row)
│   │
│   ├── dashboard/              # Protected area (auth required)
│   │   ├── layout.tsx          # Dashboard shell — desktop sidebar + MobileSidebar
│   │   ├── page.tsx            # Overview — active session info, stats
│   │   │
│   │   ├── projects/
│   │   │   ├── page.tsx        # Browse all / my projects (tabbed)
│   │   │   ├── new/page.tsx    # Create project form
│   │   │   └── [id]/
│   │   │       ├── page.tsx    # Project detail page (case study, gallery)
│   │   │       └── edit/page.tsx  # Edit project form
│   │   │
│   │   ├── resources/
│   │   │   └── page.tsx        # Public library + my submissions (tabbed)
│   │   │
│   │   ├── profile/
│   │   │   └── edit/page.tsx   # Edit avatar, bio, username, social links
│   │   │
│   │   └── admin/              # Admin-only area (role === "admin")
│   │       ├── page.tsx        # Admin panel — links to sub-sections
│   │       ├── users/page.tsx  # Manage all users — roles + deletion
│   │       └── resources/page.tsx  # Approve/reject resource submissions
│   │
│   ├── explore/page.tsx        # [NEW] Public project exploration (unauthenticated)
│   ├── forgot-password/page.tsx # [NEW] Password recovery request
│   ├── reset-password/page.tsx  # [NEW] Password reset form
│   ├── u/[username]/page.tsx   # Public portfolio page for a user
│   ├── projects/[id]/page.tsx  # Public project detail page
│   │
│   └── actions/                # Server Actions
│       ├── deleteAccount.ts    # Self account deletion with full storage cleanup
│       ├── deleteProject.ts    # Project deletion with image cleanup
│       └── adminUserActions.ts # Admin: updateUserRole, adminDeleteUser
│
├── components/
│   ├── DashboardNav.tsx        # Active-link nav used inside desktop sidebar
│   ├── MobileSidebar.tsx       # Mobile only — hamburger top bar + slide-in drawer
│   ├── ProjectActions.tsx      # Edit/Delete buttons shown on project detail page
│   ├── SafeProjectImage.tsx    # [NEW] Robust image component with error fallbacks
│   ├── DeleteModal.tsx         # Reusable confirmation dialog
│   ├── DeleteAccountButton.tsx # Triggers deleteAccount server action
│   └── admin/
│       └── UserRow.tsx         # Admin user list row — role toggle + delete
│
└── lib/
    ├── supabaseClient.ts       # Browser client (createBrowserClient)
    ├── supabaseServer.ts       # Server client with cookie auth (createServerClient)
    └── supabaseAdmin.ts        # Service-role client — bypasses RLS for admin ops
```

---

## Database Tables

| Table | Purpose |
|---|---|
| `profiles` | User profile data — `username`, `bio`, `role`, `avatar_url`, social links |
| `projects` | Project case studies — title, description, hero image, links, problem/process/solution/outcome |
| `project_images` | Gallery images linked to a project |
| `resources` | Community resource links — `status: pending / approved` |

---

## Supabase Storage Buckets

| Bucket | Contents |
|---|---|
| `avatars` | User avatars — stored at `{userId}/avatar.{ext}` |
| `project-images` | Project hero + gallery images |

---

## Key Features

### Auth & Advanced Security
- **Secure Password Policy**: Real-time strength meter and requirement validation on Register/Reset.
- **Password Visibility**: Show/hide toggles on all password inputs for better UX.
- **Forgot/Reset Flow**: Full recovery workflow integrated with Supabase Auth.
- **Security Monitoring**: Tracking `password_last_changed` with nudge banners for account safety.
- **Terms of Service**: Mandatory compliance check during registration.

### Projects & Global Exploration
- **Public Explore Page**: Discover community projects at `/explore` without needing an account.
- **Creator Attribution**: Every project card across the site now features creator avatars and @usernames.
- **Meet the Creator**: Interactive profile summaries at the bottom of project pages.
- **Safe Rendering**: Automatic "No Image" placeholders for broken or missing external assets.

### Performance & Stability
- **Image Optimization**: Priority loading for LCP (Largest Contentful Paint) images.
- **Global Footers**: Consistent site-wide footer navigation.
- **Reliable Storage**: Next.js configuration optimized for Supabase storage patterns.

### Resources
- Submit developer resource links (URL, title, description)
- Status flow: `pending` → admin approves → `approved` → visible in public library
- Users can delete their own submissions

### Admin Panel (`/dashboard/admin`)
- **Manage Users** — view all users, toggle roles (user ↔ admin), delete users with full storage cleanup
- **Resource Approvals** — approve or reject pending submissions
- Security: server-side role check on every action, self-deletion blocked, last-admin protection

### Responsive Design
- Desktop: fixed sidebar (`w-60` at md, `w-72` at lg)
- Mobile: sticky top bar + hamburger slide-in drawer (`MobileSidebar`)

---

## Required SQL Migration
To enable security tracking, run the following in your Supabase SQL Editor:
```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_last_changed timestamptz;
```

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

> `SUPABASE_SERVICE_ROLE_KEY` is server-only. Never exposed to the client.

---

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
