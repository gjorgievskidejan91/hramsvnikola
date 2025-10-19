import Link from "next/link";

// Helper function to format partial dates
function formatDate(dateObj) {
  if (!dateObj || !dateObj.year) return "-";

  // Year only
  if (!dateObj.month && !dateObj.day) {
    return `${dateObj.year}`;
  }

  // Year + Month
  if (dateObj.month && !dateObj.day) {
    return `${dateObj.month}/${dateObj.year}`;
  }

  // Full date
  return `${dateObj.day}/${dateObj.month}/${dateObj.year}`;
}

/**
 * Mobile-friendly card for death records
 */
export function DeathCard({ death }) {
  return (
    <Link href={`/umreni/${death._id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700 active:bg-gray-50 dark:active:bg-gray-700 transition-colors">
        {/* Date Badge & Page Number */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              ✝️ {formatDate(death.death.date)}
            </span>
            {death.pageNumber && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                стр. {death.pageNumber}
              </span>
            )}
          </div>
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>

        {/* Deceased Info */}
        <div className="space-y-2">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Умрен{death.deceased.gender === "Женски" ? "а" : ""}
            </div>
            <div className="font-medium text-gray-900 dark:text-white">
              {death.deceased.firstName} {death.deceased.fatherName}{" "}
              {death.deceased.lastName}
            </div>
            {death.deceased.profession && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {death.deceased.profession}
              </div>
            )}
          </div>

          {death.death.place && (
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Место на смрт
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                {death.death.place}
              </div>
            </div>
          )}

          {death.burial.date?.year && (
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Погреб
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                {formatDate(death.burial.date)}
                {death.burial.place && ` - ${death.burial.place}`}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
