"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface MobileSidebarProps {
  isAdmin: boolean;
  username: string;
  avatarUrl?: string;
  logoutAction: () => Promise<void>;
}

interface NavItem {
  name: string;
  href: string;
  exact?: boolean;
}

const mainNavItems: NavItem[] = [
  { name: "Overview", href: "/dashboard", exact: true },
  { name: "Analytics", href: "/dashboard/analytics" },
  { name: "Projects", href: "/dashboard/projects" },
  { name: "Resources", href: "/dashboard/resources" },
];

const accountNavItems = (isAdmin: boolean): NavItem[] => [
  { name: "Edit Profile", href: "/dashboard/profile/edit" },
  ...(isAdmin ? [{ name: "Admin", href: "/dashboard/admin" }] : []),
  { name: "Settings", href: "/dashboard/settings" },
];

export default function MobileSidebar({ isAdmin, username, avatarUrl, logoutAction }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const mainItems = mainNavItems;
  const accountItems = accountNavItems(isAdmin);

  return (
    <>
      <header className="md:hidden sticky top-0 z-30 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-md border-b border-gray-200/60 dark:border-white/5 shadow-sm flex items-center justify-between px-4 py-3 transition-colors duration-300">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-black dark:bg-white shadow-md transition-colors duration-300">
            <div className="w-2.5 h-2.5 bg-white dark:bg-black rounded-sm rotate-45" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-white">DevVault</span>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`md:hidden fixed top-0 left-0 h-full w-72 bg-white dark:bg-[#0A0A0A] z-50 flex flex-col p-6 shadow-2xl border-r border-gray-200/60 dark:border-white/5 transition-all duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-black dark:bg-white shadow-md transition-colors duration-300">
              <div className="w-3 h-3 bg-white dark:bg-black rounded-sm rotate-45" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">DevVault</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-4 flex flex-col gap-6 mt-2">
          <div>
            <p className="px-4 text-xs font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Menu</p>
            <nav className="space-y-1">
              {mainItems.map((item) => {
                const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-bold cursor-pointer ${isActive
                        ? "bg-black dark:bg-white text-white dark:text-black shadow-lg"
                        : "text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                      }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div>
            <p className="px-4 text-xs font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Account</p>
            <nav className="space-y-1">
              {accountItems.map((item) => {
                const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-bold cursor-pointer ${isActive
                        ? "bg-black dark:bg-white text-white dark:text-black shadow-lg"
                        : "text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                      }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-gray-100 dark:border-white/5 space-y-3">
          <Link
            href="/dashboard/profile/edit"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group"
          >
            <div className="w-9 h-9 relative rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/10 shrink-0">
              {avatarUrl ? (
                <Image src={avatarUrl} alt="Avatar" fill sizes="36px" className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 font-bold bg-gray-100 dark:bg-gray-800">
                  {username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-black dark:group-hover:text-white transition-colors duration-200">@{username || "developer"}</span>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">View Profile</span>
            </div>
          </Link>

          <form action={logoutAction}>
            <button className="w-full flex items-center justify-center gap-2 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-white/5 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/10 px-5 py-3 rounded-2xl transition-all duration-300 font-bold border border-gray-100 dark:border-white/5 cursor-pointer text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
