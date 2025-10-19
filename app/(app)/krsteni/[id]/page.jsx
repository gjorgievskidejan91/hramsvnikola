import { getChristeningById } from "@/app/actions/actionGetChristenings";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteButton } from "./DeleteButton";

export default async function ChristeningDetailPage({ params }) {
  const resolvedParams = await params;
  const christening = await getChristeningById(resolvedParams.id);

  if (!christening) {
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
            Детали за крстениче
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {formatDate(christening.christening.date)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
          <Link
            href={`/krsteni/${resolvedParams.id}/izmeni`}
            className="flex-1 sm:flex-none"
          >
            <button className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm">
              Измени
            </button>
          </Link>
          <div className="flex-1 sm:flex-none">
            <DeleteButton christeningId={resolvedParams.id} />
          </div>
          <Link href="/krsteni" className="flex-1 sm:flex-none">
            <button className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 active:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:active:bg-gray-500 text-gray-900 dark:text-white px-5 py-2.5 rounded-lg font-medium shadow-sm">
              Назад
            </button>
          </Link>
        </div>
      </div>

      {/* Податоци за Детето */}
      <section className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          👶 Податоци за Детето
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <InfoField
            label="Име на детето"
            value={christening.child.firstName}
          />
          <InfoField label="Презиме" value={christening.child.lastName} />
          <InfoField label="Пол" value={christening.child.gender} />
          <InfoField
            label="Датум на раѓање"
            value={formatDate(christening.child.birthDate)}
          />
          <InfoField
            label="Место на раѓање"
            value={christening.child.birthPlace}
          />
          <InfoField
            label="Дали е близнак"
            value={christening.isTwin ? "Да" : "Не"}
          />
        </div>
      </section>

      {/* Податоци за Родители */}
      <section className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          👨‍👩‍👧 Податоци за Родители
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <InfoField
            label="Име на Татко"
            value={christening.father.firstName}
          />
          <InfoField
            label="Презиме на Татко"
            value={christening.father.lastName}
          />
          <InfoField
            label="Име на Мајка"
            value={christening.mother.firstName}
          />
          <InfoField
            label="Презиме на Мајка"
            value={christening.mother.lastName}
          />
          <InfoField
            label="Кое дете по ред е на мајката"
            value={christening.mother.childOrderNumber}
          />
        </div>
      </section>

      {/* Податоци за Крштевањето */}
      <section className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          ⛪ Податоци за Крштевањето
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <InfoField
            label="Датум на крштевање"
            value={formatDate(christening.christening.date)}
          />
          <InfoField
            label="Храм на крштевање"
            value={christening.christening.church}
          />
          <InfoField
            label="Место на крштевање"
            value={christening.christening.place}
          />
          <InfoField
            label="Свештеник"
            value={christening.christening.priestName}
          />
          <InfoField
            label="Кум (Име)"
            value={christening.christening.godparentFirstName}
          />
          <InfoField
            label="Кум (Презиме)"
            value={christening.christening.godparentLastName}
          />
        </div>
      </section>

      {/* Дополнителни Податоци */}
      <section className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          📋 Дополнителни Податоци
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <InfoField
            label="Граѓански законо"
            value={
              christening.civillyRegistered === true
                ? "Да"
                : christening.civillyRegistered === false
                ? "Не"
                : "-"
            }
          />
          <InfoField
            label="Црковно брачно"
            value={
              christening.churchMarriage === true
                ? "Да"
                : christening.churchMarriage === false
                ? "Не"
                : "-"
            }
          />
        </div>
      </section>

      {/* Забелешки и Извор */}
      {(christening.notes || christening.pageNumber) && (
        <section className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            📝 Забелешки и Извор
          </h2>

          {christening.pageNumber && (
            <div className="mb-4">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Страна од оригинална книга
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                Страна {christening.pageNumber}
              </dd>
            </div>
          )}

          {christening.notes && (
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Забелешка
              </dt>
              <dd className="mt-1 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {christening.notes}
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
