import { getDeathById } from "@/app/actions/actionGetDeaths";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteButton } from "./DeleteButton";

export default async function DeathDetailPage({ params }) {
  const resolvedParams = await params;
  const death = await getDeathById(resolvedParams.id);

  if (!death) {
    notFound();
  }

  const formatDate = (dateObj) => {
    if (!dateObj || !dateObj.day) return "-";
    return `${dateObj.day}/${dateObj.month}/${dateObj.year}`;
  };

  return (
    <div className="max-w-6xl pb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Детали за умрен
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {formatDate(death.death.date)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
          <Link
            href={`/umreni/${resolvedParams.id}/izmeni`}
            className="flex-1 sm:flex-none"
          >
            <button className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm">
              Измени
            </button>
          </Link>
          <div className="flex-1 sm:flex-none">
            <DeleteButton deathId={resolvedParams.id} />
          </div>
          <Link href="/umreni" className="flex-1 sm:flex-none">
            <button className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 active:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:active:bg-gray-500 text-gray-900 dark:text-white px-5 py-2.5 rounded-lg font-medium shadow-sm">
              Назад
            </button>
          </Link>
        </div>
      </div>

      {/* Податоци за Умрениот */}
      <section className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          ✝️ Податоци за Умрениот
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <InfoField label="Име" value={death.deceased.firstName} />
          <InfoField label="Татково име" value={death.deceased.fatherName} />
          <InfoField label="Презиме" value={death.deceased.lastName} />
          <InfoField label="Професија" value={death.deceased.profession} />
          <InfoField
            label="Брачен статус"
            value={death.deceased.maritalStatus}
          />
          <InfoField label="Вера" value={death.deceased.religion} />
          <InfoField label="Пол" value={death.deceased.gender} />
          <InfoField
            label="Место на раѓање"
            value={death.deceased.birthPlace}
          />
          <InfoField
            label="Дата на раѓање"
            value={formatDate(death.deceased.birthDate)}
          />
        </div>
      </section>

      {/* Податоци за Умирањето */}
      <section className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          🕯️ Податоци за Умирањето
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <InfoField
            label="Датум на умирање"
            value={formatDate(death.death.date)}
          />
          <InfoField label="Место каде умрел" value={death.death.place} />
          <div className="md:col-span-2">
            <InfoField
              label="Од каква болест или начин на умирање"
              value={death.death.causeOfDeath}
            />
          </div>
        </div>
      </section>

      {/* Податоци за Погребот */}
      <section className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          ⛪ Податоци за Погребот
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <InfoField
            label="Датум на погреб"
            value={formatDate(death.burial.date)}
          />
          <InfoField label="Место на погреб" value={death.burial.place} />
          <InfoField label="Свештеник" value={death.burial.priestName} />
          <InfoField
            label="Дали се исповедал"
            value={
              death.burial.confessed === true
                ? "Да"
                : death.burial.confessed === false
                ? "Не"
                : "-"
            }
          />
        </div>
      </section>

      {/* Забелешки и Извор */}
      {(death.notes || death.pageNumber) && (
        <section className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            📝 Забелешки и Извор
          </h2>

          {death.pageNumber && (
            <div className="mb-4">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Страна од оригинална книга
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                Страна {death.pageNumber}
              </dd>
            </div>
          )}

          {death.notes && (
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Забелешка
              </dt>
              <dd className="mt-1 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {death.notes}
              </dd>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function InfoField({ label, value }) {
  return (
    <div>
      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
        {value || "-"}
      </dd>
    </div>
  );
}
