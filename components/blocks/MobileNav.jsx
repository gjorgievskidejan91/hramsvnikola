"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Mobile Navigation - Hamburger menu + Bottom nav bar
 */
export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Табла", icon: "📊" },
    { href: "/venchani", label: "Венчани", icon: "💒" },
    { href: "/umreni", label: "Умрени", icon: "✝️" },
    { href: "/krsteni", label: "Крстени", icon: "🙏" },
  ];

  return (
    <>
      {/* Top Bar with Hamburger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              ⛪ Храм Св. Никола
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Црковни Записи
            </p>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600"
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6 text-gray-900 dark:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <nav className="px-4 py-2">
              {links.map((link) => {
                const isActive =
                  pathname === link.href ||
                  pathname?.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-md my-1 text-base ${
                      isActive
                        ? "bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100 font-medium"
                        : "text-gray-700 dark:text-gray-300 active:bg-gray-100 dark:active:bg-gray-700"
                    }`}
                  >
                    <span className="mr-2">{link.icon}</span>
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 safe-bottom">
        <nav className="flex justify-around items-center h-16">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center justify-center flex-1 h-full ${
                  isActive
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                <span className="text-2xl mb-1">{link.icon}</span>
                <span className="text-xs">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
