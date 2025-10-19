import { getMarriages } from "@/app/actions/actionGetMarriages";
import Link from "next/link";
import { MarriageCard } from "@/components/blocks/MarriageCard";
import { AdvancedSearch } from "@/components/blocks/AdvancedSearch";

export default async function VenchaniPage({ searchParams }) {
  const params = await searchParams;
  const page = parseInt(params?.page || "1");

  // Build filters object from URL params
  const filters = {
    name: params?.name || "",
    dateFromYear: params?.dateFromYear || "",
    dateFromMonth: params?.dateFromMonth || "",
    dateFromDay: params?.dateFromDay || "",
    dateToYear: params?.dateToYear || "",
    dateToMonth: params?.dateToMonth || "",
    dateToDay: params?.dateToDay || "",
    church: params?.church || "",
    place: params?.place || "",
    priest: params?.priest || "",
    pageNumber: params?.pageNumber || "",
  };

  const hasFilters = Object.values(filters).some((v) => v);

  const { marriages, total, pages, currentPage } = await getMarriages(
    page,
    20,
    filters
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Книга на Венчани
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {hasFilters
              ? `Пронајдени ${total} ${total === 1 ? "запис" : "записи"}`
              : `Вкупно ${total} ${total === 1 ? "запис" : "записи"}`}
          </p>
        </div>
        <Link href="/venchani/nov" className="w-full sm:w-auto">
          <button className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm">
            + Нов запис
          </button>
        </Link>
      </div>

      {/* Advanced Search */}
      <div className="mb-6">
        <AdvancedSearch />
      </div>

      {marriages.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 sm:p-12 text-center">
          <div className="text-5xl sm:text-6xl mb-4">
            {hasFilters ? "🔍" : "📖"}
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {hasFilters ? "Нема резултати" : "Нема записи"}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
            {hasFilters
              ? "Не се пронајдени записи со избраните филтри. Обидете се со други критериуми."
              : "Започнете со внесување на првиот запис за венчавање."}
          </p>
          {hasFilters ? (
            <Link href="/venchani">
              <button className="bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium shadow-sm">
                Прикажи ги сите
              </button>
            </Link>
          ) : (
            <Link href="/venchani/nov">
              <button className="bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white px-6 py-3 rounded-lg font-medium shadow-sm">
                + Додади прв запис
              </button>
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3">
            {marriages.map((marriage) => (
              <MarriageCard key={marriage._id} marriage={marriage} />
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                      Датум
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                      Младоженец
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                      Невеста
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                      Место
                    </th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {marriages.map((marriage) => (
                    <tr
                      key={marriage._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {marriage.marriage.date.day}/
                        {marriage.marriage.date.month}/
                        {marriage.marriage.date.year}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {marriage.groom.firstName} {marriage.groom.fatherName}{" "}
                        {marriage.groom.lastName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {marriage.bride.firstName} {marriage.bride.fatherName}{" "}
                        {marriage.bride.lastName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {marriage.marriage.place || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Link
                          href={`/venchani/${marriage._id}`}
                          className="text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          Прегледај
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-3">
              {currentPage > 1 && (
                <Link
                  href={`/venchani?${new URLSearchParams({
                    ...filters,
                    page: currentPage - 1,
                  }).toString()}`}
                  className="w-full sm:w-auto"
                >
                  <button className="w-full sm:w-auto px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium">
                    ← Претходна
                  </button>
                </Link>
              )}

              <span className="px-4 py-2 text-gray-700 dark:text-gray-300 font-medium">
                Страна {currentPage} од {pages}
              </span>

              {currentPage < pages && (
                <Link
                  href={`/venchani?${new URLSearchParams({
                    ...filters,
                    page: currentPage + 1,
                  }).toString()}`}
                  className="w-full sm:w-auto"
                >
                  <button className="w-full sm:w-auto px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium">
                    Следна →
                  </button>
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
