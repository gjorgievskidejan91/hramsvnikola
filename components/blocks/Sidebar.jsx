"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Sidebar навигација
 */
export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "📊 Табла", icon: "📊" },
    { href: "/venchani", label: "💒 Венчани", icon: "💒" },
    { href: "/umreni", label: "✝️ Умрени", icon: "✝️" },
    { href: "/krsteni", label: "🙏 Крстени", icon: "🙏" },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          ⛪ Храм Св. Никола
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Црковни Записи
        </p>
      </div>

      <nav className="space-y-2">
        {links.map((link) => {
          const isActive =
            pathname === link.href || pathname?.startsWith(link.href + "/");

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-2 rounded-md transition-colors ${
                isActive
                  ? "bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100 font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
