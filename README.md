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

### Auth & Profiles
- Email/password auth via Supabase Auth
- Profile row auto-created on registration
- Roles: `user` (default) or `admin`

### Projects
- Create, edit, delete project case studies
- Hero image upload + gallery images
- Case study sections: Problem → Process → Solution → Outcome
- Visible as a public portfolio at `/u/[username]`

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
