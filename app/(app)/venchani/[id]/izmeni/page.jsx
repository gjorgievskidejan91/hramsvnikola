import { getMarriageById } from "@/app/actions/actionGetMarriages";
import { MarriageForm } from "@/components/blocks/MarriageForm";
import { notFound } from "next/navigation";

export default async function IzmeniPage({ params }) {
  const resolvedParams = await params;
  const marriage = await getMarriageById(resolvedParams.id);

  if (!marriage) {
    notFound();
  }

  // Форматирај податоците за формата
  const initialData = {
    groom: {
      firstName: marriage.groom.firstName || "",
      fatherName: marriage.groom.fatherName || "",
      lastName: marriage.groom.lastName || "",
      profession: marriage.groom.profession || "",
      residence: marriage.groom.residence || "",
      religion: marriage.groom.religion || "",
      nationality: marriage.groom.nationality || "",
      birthDate: {
        day: marriage.groom.birthDate?.day
          ? String(marriage.groom.birthDate.day).padStart(2, "0")
          : "",
        month: marriage.groom.birthDate?.month
          ? String(marriage.groom.birthDate.month).padStart(2, "0")
          : "",
        year: marriage.groom.birthDate?.year?.toString() || "",
      },
      maritalStatus: marriage.groom.maritalStatus || "",
      marriageNumber: marriage.groom.marriageNumber?.toString() || "",
    },
    bride: {
      firstName: marriage.bride.firstName || "",
      fatherName: marriage.bride.fatherName || "",
      lastName: marriage.bride.lastName || "",
      profession: marriage.bride.profession || "",
      residence: marriage.bride.residence || "",
      religion: marriage.bride.religion || "",
      nationality: marriage.bride.nationality || "",
      birthDate: {
        day: marriage.bride.birthDate?.day
          ? String(marriage.bride.birthDate.day).padStart(2, "0")
          : "",
        month: marriage.bride.birthDate?.month
          ? String(marriage.bride.birthDate.month).padStart(2, "0")
          : "",
        year: marriage.bride.birthDate?.year?.toString() || "",
      },
      maritalStatus: marriage.bride.maritalStatus || "",
      marriageNumber: marriage.bride.marriageNumber?.toString() || "",
    },
    marriage: {
      church: marriage.marriage.church || "",
      place: marriage.marriage.place || "",
      date: {
        day: marriage.marriage.date?.day
          ? String(marriage.marriage.date.day).padStart(2, "0")
          : "",
        month: marriage.marriage.date?.month
          ? String(marriage.marriage.date.month).padStart(2, "0")
          : "",
        year: marriage.marriage.date?.year?.toString() || "",
      },
      priestName: marriage.marriage.priestName || "",
      bestMan: {
        firstName:
          marriage.marriage.bestMan?.firstName ||
          marriage.marriage.bestMan?.name ||
          "",
        lastName: marriage.marriage.bestMan?.lastName || "",
        residence: marriage.marriage.bestMan?.residence || "",
      },
      witness: {
        firstName:
          marriage.marriage.witness?.firstName ||
          marriage.marriage.witness?.name ||
          "",
        lastName: marriage.marriage.witness?.lastName || "",
        residence: marriage.marriage.witness?.residence || "",
      },
    },
    notes: marriage.notes || "",
    pageNumber: marriage.pageNumber?.toString() || "",
  };

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
        Измени запис
      </h1>
      <MarriageForm initialData={initialData} marriageId={resolvedParams.id} />
    </div>
  );
}
