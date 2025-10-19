"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * SearchBar за пребарување на записи
 * Пребарува по: име, презиме, место, храм, година
 */
export function SearchBar({
  placeholder = "Пребарај по име, презиме, место, година...",
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

  const handleSearch = (e) => {
    e.preventDefault();

    if (searchTerm.trim()) {
      router.push(`?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push("?");
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    router.push("?");
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-11 pr-24 py-3 sm:py-2.5 text-base sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800"
        />

        <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-2">
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              aria-label="Исчисти"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          <button
            type="submit"
            className="px-4 py-1.5 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white text-sm font-medium rounded-md transition-colors"
          >
            Барај
          </button>
        </div>
      </div>
    </form>
  );
}
