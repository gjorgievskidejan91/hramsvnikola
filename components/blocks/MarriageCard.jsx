import Link from "next/link";

/**
 * Mobile-friendly card for marriage records
 */
export function MarriageCard({ marriage }) {
  return (
    <Link href={`/venchani/${marriage._id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700 active:bg-gray-50 dark:active:bg-gray-700 transition-colors">
        {/* Date Badge & Page Number */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
              {marriage.marriage.date.day}/{marriage.marriage.date.month}/
              {marriage.marriage.date.year}
            </span>
            {marriage.pageNumber && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                стр. {marriage.pageNumber}
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

        {/* People Info */}
        <div className="space-y-2">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Младоженец
            </div>
            <div className="font-medium text-gray-900 dark:text-white">
              {marriage.groom.firstName} {marriage.groom.fatherName}{" "}
              {marriage.groom.lastName}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Невеста
            </div>
            <div className="font-medium text-gray-900 dark:text-white">
              {marriage.bride.firstName} {marriage.bride.fatherName}{" "}
              {marriage.bride.lastName}
            </div>
          </div>

          {marriage.marriage.place && (
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Место
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                {marriage.marriage.place}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
