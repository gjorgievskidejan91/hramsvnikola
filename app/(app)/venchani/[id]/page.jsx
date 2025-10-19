import { getMarriageById } from "@/app/actions/actionGetMarriages";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteButton } from "./DeleteButton";

export default async function MarriageDetailPage({ params }) {
  const resolvedParams = await params;
  const marriage = await getMarriageById(resolvedParams.id);

  if (!marriage) {
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
            Детали за венчавање
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {formatDate(marriage.marriage.date)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
          <Link
            href={`/venchani/${resolvedParams.id}/izmeni`}
            className="flex-1 sm:flex-none"
          >
            <button className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm">
              Измени
            </button>
          </Link>
          <div className="flex-1 sm:flex-none">
            <DeleteButton marriageId={resolvedParams.id} />
          </div>
          <Link href="/venchani" className="flex-1 sm:flex-none">
            <button className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 active:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:active:bg-gray-500 text-gray-900 dark:text-white px-5 py-2.5 rounded-lg font-medium shadow-sm">
              Назад
            </button>
          </Link>
        </div>
      </div>

      {/* Младоженец */}
      <section className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          🤵 Младоженец
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <InfoField label="Име" value={marriage.groom.firstName} />
          <InfoField label="Татково име" value={marriage.groom.fatherName} />
          <InfoField label="Презиме" value={marriage.groom.lastName} />
          <InfoField
            label="Датум на раѓање"
            value={formatDate(marriage.groom.birthDate)}
          />
          <InfoField label="Професија" value={marriage.groom.profession} />
          <InfoField
            label="Место на живеење"
            value={marriage.groom.residence}
          />
          <InfoField label="Вера" value={marriage.groom.religion} />
          <InfoField label="Народност" value={marriage.groom.nationality} />
          <InfoField
            label="Брачен статус"
            value={marriage.groom.maritalStatus}
          />
          <InfoField
            label="Во кој брак стапува"
            value={marriage.groom.marriageNumber}
          />
        </div>
      </section>

      {/* Невеста */}
      <section className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          👰 Невеста
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <InfoField label="Име" value={marriage.bride.firstName} />
          <InfoField label="Татково име" value={marriage.bride.fatherName} />
          <InfoField label="Презиме" value={marriage.bride.lastName} />
          <InfoField
            label="Датум на раѓање"
            value={formatDate(marriage.bride.birthDate)}
          />
          <InfoField label="Професија" value={marriage.bride.profession} />
          <InfoField
            label="Место на живеење"
            value={marriage.bride.residence}
          />
          <InfoField label="Вера" value={marriage.bride.religion} />
          <InfoField label="Народност" value={marriage.bride.nationality} />
          <InfoField
            label="Брачен статус"
            value={marriage.bride.maritalStatus}
          />
          <InfoField
            label="Во кој брак стапува"
            value={marriage.bride.marriageNumber}
          />
        </div>
      </section>

      {/* Венчавање */}
      <section className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          ⛪ Венчавање
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <InfoField
            label="Датум на венчавање"
            value={formatDate(marriage.marriage.date)}
          />
          <InfoField label="Храм" value={marriage.marriage.church} />
          <InfoField label="Место" value={marriage.marriage.place} />
          <InfoField label="Свештеник" value={marriage.marriage.priestName} />
          <InfoField
            label="Кум"
            value={
              marriage.marriage.bestMan?.firstName &&
              marriage.marriage.bestMan?.lastName
                ? `${marriage.marriage.bestMan.firstName} ${marriage.marriage.bestMan.lastName}`
                : marriage.marriage.bestMan?.name || "-"
            }
          />
          <InfoField
            label="Кум (место)"
            value={marriage.marriage.bestMan?.residence}
          />
          <InfoField
            label="Стар сват"
            value={
              marriage.marriage.witness?.firstName &&
              marriage.marriage.witness?.lastName
                ? `${marriage.marriage.witness.firstName} ${marriage.marriage.witness.lastName}`
                : marriage.marriage.witness?.name || "-"
            }
          />
          <InfoField
            label="Стар сват (место)"
            value={marriage.marriage.witness?.residence}
          />
        </div>
      </section>

      {/* Забелешки и Извор */}
      {(marriage.notes || marriage.pageNumber) && (
        <section className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            📝 Забелешки и Извор
          </h2>

          {marriage.pageNumber && (
            <div className="mb-4">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Страна од оригинална книга
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                Страна {marriage.pageNumber}
              </dd>
            </div>
          )}

          {marriage.notes && (
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Забелешка
              </dt>
              <dd className="mt-1 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {marriage.notes}
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
