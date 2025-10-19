import { getMarriages } from "@/app/actions/actionGetMarriages";
import { getDeaths } from "@/app/actions/actionGetDeaths";
import { getChristenings } from "@/app/actions/actionGetChristenings";
import Link from "next/link";

export default async function DashboardPage() {
  const { marriages, total: totalMarriages } = await getMarriages(1, 5);
  const { deaths, total: totalDeaths } = await getDeaths(1, 5);
  const { christenings, total: totalChristenings } = await getChristenings(
    1,
    5
  );

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Табла
      </h1>

      {/* Статистика */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow">
          <h3 className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-1">
            Вкупно венчавања
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {totalMarriages}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow">
          <h3 className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-1">
            Вкупно умрени
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {totalDeaths}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow">
          <h3 className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-1">
            Вкупно крстени
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {totalChristenings}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow">
          <h3 className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-1">
            Статус
          </h3>
          <p className="text-base sm:text-lg font-semibold text-green-600 dark:text-green-400">
            ✓ Активна
          </p>
        </div>
      </div>

      {/* Последни записи - Венчавања */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            Последни венчавања
          </h2>
          <Link
            href="/venchani"
            className="text-primary-600 dark:text-primary-400 hover:underline"
          >
            Сите записи →
          </Link>
        </div>

        {marriages.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <p className="mb-4">Сè уште нема внесени записи.</p>
            <Link
              href="/venchani/nov"
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium"
            >
              + Додади прв запис
            </Link>
          </div>
        ) : (
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
                      {marriage.groom.firstName} {marriage.groom.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {marriage.bride.firstName} {marriage.bride.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {marriage.marriage.place || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Последни записи - Умрени */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            Последни умрени
          </h2>
          <Link
            href="/umreni"
            className="text-primary-600 dark:text-primary-400 hover:underline"
          >
            Сите записи →
          </Link>
        </div>

        {deaths.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <p className="mb-4">Сè уште нема внесени записи.</p>
            <Link
              href="/umreni/nov"
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium"
            >
              + Додади прв запис
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Датум на смрт
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Име и презиме
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Професија
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Место
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {deaths.map((death) => (
                  <tr
                    key={death._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {death.death.date.day}/{death.death.date.month}/
                      {death.death.date.year}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {death.deceased.firstName} {death.deceased.fatherName}{" "}
                      {death.deceased.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {death.deceased.profession || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {death.death.place || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
