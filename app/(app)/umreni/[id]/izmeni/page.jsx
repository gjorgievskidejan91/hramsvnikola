import { getDeathById } from "@/app/actions/actionGetDeaths";
import { DeathForm } from "@/components/blocks/DeathForm";
import { notFound } from "next/navigation";

export default async function IzmeniPage({ params }) {
  const resolvedParams = await params;
  const death = await getDeathById(resolvedParams.id);

  if (!death) {
    notFound();
  }

  // Форматирај податоците за формата
  const initialData = {
    deceased: {
      firstName: death.deceased.firstName || "",
      fatherName: death.deceased.fatherName || "",
      lastName: death.deceased.lastName || "",
      profession: death.deceased.profession || "",
      maritalStatus: death.deceased.maritalStatus || "",
      religion: death.deceased.religion || "",
      gender: death.deceased.gender || "",
      birthPlace: death.deceased.birthPlace || "",
      birthDate: {
        day: death.deceased.birthDate?.day
          ? String(death.deceased.birthDate.day).padStart(2, "0")
          : "",
        month: death.deceased.birthDate?.month
          ? String(death.deceased.birthDate.month).padStart(2, "0")
          : "",
        year: death.deceased.birthDate?.year?.toString() || "",
      },
    },
    death: {
      place: death.death.place || "",
      date: {
        day: death.death.date?.day
          ? String(death.death.date.day).padStart(2, "0")
          : "",
        month: death.death.date?.month
          ? String(death.death.date.month).padStart(2, "0")
          : "",
        year: death.death.date?.year?.toString() || "",
      },
      causeOfDeath: death.death.causeOfDeath || "",
    },
    burial: {
      date: {
        day: death.burial.date?.day
          ? String(death.burial.date.day).padStart(2, "0")
          : "",
        month: death.burial.date?.month
          ? String(death.burial.date.month).padStart(2, "0")
          : "",
        year: death.burial.date?.year?.toString() || "",
      },
      place: death.burial.place || "",
      priestName: death.burial.priestName || "",
      confessed: death.burial.confessed ?? "",
    },
    notes: death.notes || "",
    pageNumber: death.pageNumber?.toString() || "",
  };

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
        Измени запис
      </h1>
      <DeathForm initialData={initialData} deathId={resolvedParams.id} />
    </div>
  );
}
