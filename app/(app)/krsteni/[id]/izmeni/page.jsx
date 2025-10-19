import { getChristeningById } from "@/app/actions/actionGetChristenings";
import { ChristeningForm } from "@/components/blocks/ChristeningForm";
import { notFound } from "next/navigation";

export default async function IzmeniPage({ params }) {
  const resolvedParams = await params;
  const christening = await getChristeningById(resolvedParams.id);

  if (!christening) {
    notFound();
  }

  // Форматирај податоците за формата
  const initialData = {
    child: {
      firstName: christening.child.firstName || "",
      lastName: christening.child.lastName || "",
      gender: christening.child.gender || "",
      birthDate: {
        day: christening.child.birthDate?.day
          ? String(christening.child.birthDate.day).padStart(2, "0")
          : "",
        month: christening.child.birthDate?.month
          ? String(christening.child.birthDate.month).padStart(2, "0")
          : "",
        year: christening.child.birthDate?.year?.toString() || "",
      },
      birthPlace: christening.child.birthPlace || "Битола",
    },
    father: {
      firstName: christening.father.firstName || "",
      lastName: christening.father.lastName || "",
    },
    mother: {
      firstName: christening.mother.firstName || "",
      lastName: christening.mother.lastName || "",
      childOrderNumber: christening.mother.childOrderNumber?.toString() || "",
    },
    christening: {
      date: {
        day: christening.christening.date?.day
          ? String(christening.christening.date.day).padStart(2, "0")
          : "",
        month: christening.christening.date?.month
          ? String(christening.christening.date.month).padStart(2, "0")
          : "",
        year: christening.christening.date?.year?.toString() || "",
      },
      church: christening.christening.church || "",
      place: christening.christening.place || "",
      priestName: christening.christening.priestName || "",
      godparentFirstName: christening.christening.godparentFirstName || "",
      godparentLastName: christening.christening.godparentLastName || "",
    },
    civillyRegistered: christening.civillyRegistered ?? undefined,
    churchMarriage: christening.churchMarriage ?? undefined,
    isTwin: christening.isTwin ?? false,
    notes: christening.notes || "",
    pageNumber: christening.pageNumber?.toString() || "",
  };

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
        Измени запис
      </h1>
      <ChristeningForm
        initialData={initialData}
        christeningId={resolvedParams.id}
      />
    </div>
  );
}
