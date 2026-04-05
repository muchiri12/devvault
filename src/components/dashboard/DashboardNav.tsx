"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  const mainNavItems = [
    { name: "Overview", href: "/dashboard", exact: true },
    { name: "Analytics", href: "/dashboard/analytics" },
    { name: "Projects", href: "/dashboard/projects" },
    { name: "Resources", href: "/dashboard/resources" },
  ];

  const accountNavItems = [
    { name: "Edit Profile", href: "/dashboard/profile/edit" },
    ...(isAdmin ? [{ name: "Admin", href: "/dashboard/admin" }] : []),
    { name: "Settings", href: "/dashboard/settings" },
  ];

  const renderLinks = (items: typeof mainNavItems) => (
    <div className="space-y-1">
      {items.map((item) => {
        const isActive = item.exact 
          ? pathname === item.href 
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300 font-bold cursor-pointer ${
              isActive 
                ? "bg-black dark:bg-white text-white dark:text-black shadow-lg" 
                : "text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {item.name}
          </Link>
        );
      })}
    </div>
  );

  return (
    <nav className="flex-1 mt-6 flex flex-col gap-6">
      <div>
        <p className="px-5 text-xs font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Menu</p>
        {renderLinks(mainNavItems)}
      </div>
      <div>
        <p className="px-5 text-xs font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Account</p>
        {renderLinks(accountNavItems)}
      </div>
    </nav>
  );
}
