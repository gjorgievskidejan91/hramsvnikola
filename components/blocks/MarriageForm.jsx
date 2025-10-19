"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DateInput } from "@/components/ui/DateInput";
import { AutocompleteInput } from "@/components/ui/AutocompleteInput";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { createMarriage } from "@/app/actions/actionCreateMarriage";
import { updateMarriage } from "@/app/actions/actionUpdateMarriage";

/**
 * Форма за венчавање - креирање и измена
 * @param {Object} props
 * @param {Object} props.initialData - Иницијални податоци за измена
 * @param {string} props.marriageId - ID за измена
 */
export function MarriageForm({ initialData, marriageId }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState(
    initialData || {
      groom: {
        firstName: "",
        fatherName: "",
        lastName: "",
        profession: "",
        residence: "Кукуречани",
        religion: "Православен",
        nationality: "Македонец",
        birthDate: { day: "", month: "", year: "" },
        maritalStatus: "",
        marriageNumber: "",
      },
      bride: {
        firstName: "",
        fatherName: "",
        lastName: "",
        profession: "",
        residence: "Кукуречани",
        religion: "Православна",
        nationality: "Македонка",
        birthDate: { day: "", month: "", year: "" },
        maritalStatus: "",
        marriageNumber: "",
      },
      marriage: {
        church: "Свети Никола",
        place: "Кукуречани",
        date: { day: "", month: "", year: "" },
        priestName: "",
        bestMan: { firstName: "", lastName: "", residence: "" },
        witness: { firstName: "", lastName: "", residence: "" },
      },
      notes: "",
      pageNumber: "",
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const result = marriageId
        ? await updateMarriage(marriageId, formData)
        : await createMarriage(formData);

      if (result.success) {
        router.push("/venchani");
      } else {
        setError(result.error || "Настана грешка.");
      }
    } catch (err) {
      setError("Настана грешка при зачувување.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const updateNestedField = (section, parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parent]: {
          ...prev[section][parent],
          [field]: value,
        },
      },
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 sm:space-y-8 max-w-6xl mb-20 lg:mb-0"
    >
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg text-sm sm:text-base">
          {error}
        </div>
      )}

      {/* Младоженец */}
      <section className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          🤵 Младоженец
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <AutocompleteInput
            label="Име"
            field="firstName"
            type="groom"
            gender="male"
            value={formData.groom.firstName}
            onChange={(val) => updateField("groom", "firstName", val)}
            required
          />

          <AutocompleteInput
            label="Татково име"
            field="firstName"
            type="groom"
            gender="male"
            value={formData.groom.fatherName}
            onChange={(val) => updateField("groom", "fatherName", val)}
            required
          />

          <AutocompleteInput
            label="Презиме"
            field="lastName"
            type="groom"
            value={formData.groom.lastName}
            onChange={(val) => updateField("groom", "lastName", val)}
            required
          />

          <DateInput
            label="Датум на раѓање"
            value={formData.groom.birthDate}
            onChange={(val) => updateField("groom", "birthDate", val)}
          />

          <Input
            label="Професија"
            value={formData.groom.profession}
            onChange={(e) => updateField("groom", "profession", e.target.value)}
          />

          <Select
            label="Место на живеење"
            value={formData.groom.residence}
            onChange={(val) => updateField("groom", "residence", val)}
            options={["Кукуречани"]}
            allowCustom={true}
          />

          <Select
            label="Вера"
            value={formData.groom.religion}
            onChange={(val) => updateField("groom", "religion", val)}
            options={["Православен", "Католик", "Муслиман", "Протестант"]}
            allowCustom={true}
          />

          <Select
            label="Народност"
            value={formData.groom.nationality}
            onChange={(val) => updateField("groom", "nationality", val)}
            options={[
              "Македонец",
              "Албанец",
              "Турчин",
              "Ром",
              "Србин",
              "Бошњак",
              "Влав",
            ]}
            allowCustom={true}
          />

          <Input
            label="Брачен статус"
            value={formData.groom.maritalStatus}
            onChange={(e) =>
              updateField("groom", "maritalStatus", e.target.value)
            }
          />

          <Input
            label="Во кој брак стапува"
            type="number"
            value={formData.groom.marriageNumber}
            onChange={(e) =>
              updateField("groom", "marriageNumber", e.target.value)
            }
          />
        </div>
      </section>

      {/* Невеста */}
      <section className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          👰 Невеста
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <AutocompleteInput
            label="Име"
            field="firstName"
            type="bride"
            gender="female"
            value={formData.bride.firstName}
            onChange={(val) => updateField("bride", "firstName", val)}
            required
          />

          <AutocompleteInput
            label="Татково име"
            field="firstName"
            type="bride"
            gender="male"
            value={formData.bride.fatherName}
            onChange={(val) => updateField("bride", "fatherName", val)}
            required
          />

          <AutocompleteInput
            label="Презиме"
            field="lastName"
            type="bride"
            value={formData.bride.lastName}
            onChange={(val) => updateField("bride", "lastName", val)}
            required
          />

          <DateInput
            label="Датум на раѓање"
            value={formData.bride.birthDate}
            onChange={(val) => updateField("bride", "birthDate", val)}
          />

          <Input
            label="Професија"
            value={formData.bride.profession}
            onChange={(e) => updateField("bride", "profession", e.target.value)}
          />

          <Select
            label="Место на живеење"
            value={formData.bride.residence}
            onChange={(val) => updateField("bride", "residence", val)}
            options={["Кукуречани"]}
            allowCustom={true}
          />

          <Select
            label="Вера"
            value={formData.bride.religion}
            onChange={(val) => updateField("bride", "religion", val)}
            options={["Православна", "Католичка", "Муслиманка", "Протестантка"]}
            allowCustom={true}
          />

          <Select
            label="Народност"
            value={formData.bride.nationality}
            onChange={(val) => updateField("bride", "nationality", val)}
            options={[
              "Македонка",
              "Албанка",
              "Туркинка",
              "Ромка",
              "Српкиња",
              "Бошњачка",
              "Влашка",
            ]}
            allowCustom={true}
          />

          <Input
            label="Брачен статус"
            value={formData.bride.maritalStatus}
            onChange={(e) =>
              updateField("bride", "maritalStatus", e.target.value)
            }
          />

          <Input
            label="Во кој брак стапува"
            type="number"
            value={formData.bride.marriageNumber}
            onChange={(e) =>
              updateField("bride", "marriageNumber", e.target.value)
            }
          />
        </div>
      </section>

      {/* Венчавање */}
      <section className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          ⛪ Венчавање
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <DateInput
            label="Датум на венчавање"
            value={formData.marriage.date}
            onChange={(val) => updateField("marriage", "date", val)}
            required
          />

          <Select
            label="Храм"
            value={formData.marriage.church}
            onChange={(val) => updateField("marriage", "church", val)}
            options={["Свети Никола", "Св. Петка", "Св. Богородица"]}
            allowCustom={true}
          />

          <Select
            label="Место"
            value={formData.marriage.place}
            onChange={(val) => updateField("marriage", "place", val)}
            options={["Кукуречани"]}
            allowCustom={true}
          />

          <AutocompleteInput
            label="Свештеник (име и презиме)"
            field="priest"
            type="marriage"
            value={formData.marriage.priestName}
            onChange={(val) => updateField("marriage", "priestName", val)}
          />

          <div></div>

          <AutocompleteInput
            label="Кум - Име"
            field="firstName"
            type="marriage"
            gender="male"
            value={formData.marriage.bestMan.firstName}
            onChange={(val) =>
              updateNestedField("marriage", "bestMan", "firstName", val)
            }
          />

          <AutocompleteInput
            label="Кум - Презиме"
            field="lastName"
            type="marriage"
            value={formData.marriage.bestMan.lastName}
            onChange={(val) =>
              updateNestedField("marriage", "bestMan", "lastName", val)
            }
          />

          <Input
            label="Кум - Место на живеење"
            value={formData.marriage.bestMan.residence}
            onChange={(e) =>
              updateNestedField(
                "marriage",
                "bestMan",
                "residence",
                e.target.value
              )
            }
          />

          <div></div>

          <AutocompleteInput
            label="Стар сват - Име"
            field="firstName"
            type="marriage"
            gender="male"
            value={formData.marriage.witness.firstName}
            onChange={(val) =>
              updateNestedField("marriage", "witness", "firstName", val)
            }
          />

          <AutocompleteInput
            label="Стар сват - Презиме"
            field="lastName"
            type="marriage"
            value={formData.marriage.witness.lastName}
            onChange={(val) =>
              updateNestedField("marriage", "witness", "lastName", val)
            }
          />

          <Input
            label="Стар сват - Место на живеење"
            value={formData.marriage.witness.residence}
            onChange={(e) =>
              updateNestedField(
                "marriage",
                "witness",
                "residence",
                e.target.value
              )
            }
          />
        </div>
      </section>

      {/* Забелешки и Извор */}
      <section className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          📝 Забелешки и Извор
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <Input
            label="Страна од оригинална книга"
            type="number"
            placeholder="Број на страна..."
            value={formData.pageNumber}
            onChange={(e) =>
              setFormData({ ...formData, pageNumber: e.target.value })
            }
          />
          <div></div>
        </div>
        <div className="mt-4">
          <Textarea
            label="Забелешка"
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            rows={4}
          />
        </div>
      </section>

      {/* Копчиња */}
      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 sm:flex-none py-3 sm:py-2 text-base sm:text-sm"
        >
          {isSubmitting ? "Се зачувува..." : "Зачувај"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="flex-1 sm:flex-none py-3 sm:py-2 text-base sm:text-sm"
        >
          Откажи
        </Button>
      </div>
    </form>
  );
}
