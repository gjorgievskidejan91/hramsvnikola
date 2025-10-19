import Link from "next/link";

/**
 * Mobile-friendly card for christening records
 */
export function ChristeningCard({ christening }) {
  return (
    <Link href={`/krsteni/${christening._id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700 active:bg-gray-50 dark:active:bg-gray-700 transition-colors">
        {/* Date Badge & Page Number */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
              🙏 {christening.christening.date.day}/
              {christening.christening.date.month}/
              {christening.christening.date.year}
            </span>
            {christening.pageNumber && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                стр. {christening.pageNumber}
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

        {/* Child Info */}
        <div className="space-y-2">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Крстениче {christening.isTwin && "👶👶"}
            </div>
            <div className="font-medium text-gray-900 dark:text-white">
              {christening.child.firstName} {christening.child.lastName || ""}
            </div>
            {christening.child.gender && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {christening.child.gender}
              </div>
            )}
          </div>

          {/* Parents */}
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Родители
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {christening.father.firstName} {christening.father.lastName} и{" "}
              {christening.mother.firstName} {christening.mother.lastName}
            </div>
          </div>

          {/* Birth place and date */}
          {(christening.child.birthPlace || christening.child.birthDate) && (
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Раѓање
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                {christening.child.birthDate && (
                  <>
                    {christening.child.birthDate.day}/
                    {christening.child.birthDate.month}/
                    {christening.child.birthDate.year}
                  </>
                )}
                {christening.child.birthPlace &&
                  christening.child.birthDate &&
                  " - "}
                {christening.child.birthPlace}
              </div>
            </div>
          )}

          {/* Godparent */}
          {(christening.christening.godparentFirstName ||
            christening.christening.godparentLastName) && (
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Кум
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                {christening.christening.godparentFirstName}{" "}
                {christening.christening.godparentLastName}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
