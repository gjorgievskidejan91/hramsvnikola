import { getChristenings } from "@/app/actions/actionGetChristenings";
import Link from "next/link";
import { ChristeningCard } from "@/components/blocks/ChristeningCard";

export default async function KrsteniPage({ searchParams }) {
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
    place: params?.place || "",
    priest: params?.priest || "",
    godparent: params?.godparent || "",
    pageNumber: params?.pageNumber || "",
    gender: params?.gender || "",
  };

  const hasFilters = Object.values(filters).some((v) => v);

  const { christenings, total, pages, currentPage } = await getChristenings(
    page,
    20,
    filters
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Книга на Крстени
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {hasFilters
              ? `Пронајдени ${total} ${total === 1 ? "запис" : "записи"}`
              : `Вкупно ${total} ${total === 1 ? "запис" : "записи"}`}
          </p>
        </div>
        <Link href="/krsteni/nov" className="w-full sm:w-auto">
          <button className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm">
            + Нов запис
          </button>
        </Link>
      </div>

      {christenings.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 sm:p-12 text-center">
          <div className="text-5xl sm:text-6xl mb-4">
            {hasFilters ? "🔍" : "🙏"}
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {hasFilters ? "Нема резултати" : "Нема записи"}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
            {hasFilters
              ? "Не се пронајдени записи со избраните филтри. Обидете се со други критериуми."
              : "Започнете со внесување на првиот запис за крстениче."}
          </p>
          {hasFilters ? (
            <Link href="/krsteni">
              <button className="bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium shadow-sm">
                Прикажи ги сите
              </button>
            </Link>
          ) : (
            <Link href="/krsteni/nov">
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
            {christenings.map((christening) => (
              <ChristeningCard
                key={christening._id}
                christening={christening}
              />
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                      Датум на крштевање
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                      Име на дете
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                      Родители
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                      Место
                    </th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {christenings.map((christening) => (
                    <tr
                      key={christening._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {christening.christening.date.day}/
                        {christening.christening.date.month}/
                        {christening.christening.date.year}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {christening.child.firstName}{" "}
                        {christening.child.lastName || ""}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {christening.father.firstName} и{" "}
                        {christening.mother.firstName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {christening.child.birthPlace || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Link
                          href={`/krsteni/${christening._id}`}
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
                  href={`/krsteni?${new URLSearchParams({
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
                  href={`/krsteni?${new URLSearchParams({
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
