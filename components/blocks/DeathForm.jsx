"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { DateInput } from "@/components/ui/DateInput";
import { DateInputPartial } from "@/components/ui/DateInputPartial";
import { AutocompleteInput } from "@/components/ui/AutocompleteInput";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { RadioToggle } from "@/components/ui/RadioToggle";
import { PLACES } from "@/components/ui/ChurchPlaceSelect";
import { createDeath } from "@/app/actions/actionCreateDeath";
import { updateDeath } from "@/app/actions/actionUpdateDeath";

/**
 * Форма за умрен - креирање и измена
 * @param {Object} props
 * @param {Object} props.initialData - Иницијални податоци за измена
 * @param {string} props.deathId - ID за измена
 */
export function DeathForm({ initialData, deathId }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const formRef = useRef(null);

  const [formData, setFormData] = useState(
    initialData || {
      deceased: {
        firstName: "",
        fatherName: "",
        lastName: "",
        profession: "",
        maritalStatus: "",
        religion: "Православна",
        gender: "",
        birthPlace: "Битола",
        birthDate: { day: "", month: "", year: "" },
      },
      death: {
        place: "Кукуречани",
        date: { day: "", month: "", year: "" },
        causeOfDeath: "",
      },
      burial: {
        date: { day: "", month: "", year: "" },
        place: "Кукуречани",
        priestName: "",
        confessed: "Не",
      },
      notes: "",
      pageNumber: "",
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setFieldErrors({});

    try {
      const result = deathId
        ? await updateDeath(deathId, formData)
        : await createDeath(formData);

      if (result.success) {
        toast.success(
          deathId
            ? "✅ Записот е успешно ажуриран!"
            : "✅ Записот е успешно креиран!",
          { duration: 3000 }
        );

        // Delay redirect to show toast
        setTimeout(() => {
          router.push("/umreni");
        }, 500);
      } else {
        const errorMsg = result.error || "Настана грешка.";
        setError(errorMsg);

        // Parse field errors if available
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }

        toast.error("❌ " + errorMsg);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      const errorMsg = "Настана грешка при зачувување.";
      setError(errorMsg);
      toast.error("❌ " + errorMsg);
      window.scrollTo({ top: 0, behavior: "smooth" });
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

      {/* 1. Основни податоци за умрениот */}
      <section className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          ✝️ Податоци за Умрениот
        </h2>

        {/* Пол - Toggle Buttons */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Пол <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
            <button
              type="button"
              onClick={() => updateField("deceased", "gender", "Машки")}
              className={`px-6 py-3 sm:px-8 sm:py-2.5 text-sm font-medium transition-colors ${
                formData.deceased.gender === "Машки"
                  ? "bg-primary-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              Машки
            </button>
            <button
              type="button"
              onClick={() => updateField("deceased", "gender", "Женски")}
              className={`px-6 py-3 sm:px-8 sm:py-2.5 text-sm font-medium transition-colors border-l border-gray-300 dark:border-gray-600 ${
                formData.deceased.gender === "Женски"
                  ? "bg-primary-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              Женски
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <AutocompleteInput
            label="Име"
            field="firstName"
            type="deceased"
            gender={
              formData.deceased.gender === "Машки"
                ? "male"
                : formData.deceased.gender === "Женски"
                ? "female"
                : undefined
            }
            value={formData.deceased.firstName}
            onChange={(val) => updateField("deceased", "firstName", val)}
            error={fieldErrors["deceased.firstName"]}
            required
          />

          <AutocompleteInput
            label="Татково име"
            field="fatherName"
            type="deceased"
            gender="male"
            value={formData.deceased.fatherName}
            onChange={(val) => updateField("deceased", "fatherName", val)}
          />

          <AutocompleteInput
            label="Презиме"
            field="lastName"
            type="deceased"
            value={formData.deceased.lastName}
            onChange={(val) => updateField("deceased", "lastName", val)}
            error={fieldErrors["deceased.lastName"]}
            required
          />

          <Input
            label="Професија"
            value={formData.deceased.profession}
            onChange={(e) =>
              updateField("deceased", "profession", e.target.value)
            }
          />

          <Select
            label="Брачен статус"
            value={formData.deceased.maritalStatus}
            onChange={(val) => updateField("deceased", "maritalStatus", val)}
            options={["Неженет/Немажена", "Женет/Мажена", "Вдовец/Вдовица"]}
            allowCustom={true}
          />

          <Select
            label="Вера"
            value={formData.deceased.religion}
            onChange={(val) => updateField("deceased", "religion", val)}
            options={[
              "Православна",
              "Католичка",
              "Муслиманска",
              "Протестантска",
            ]}
            allowCustom={true}
          />
        </div>
      </section>

      {/* 2. Место и датум на умирање */}
      <section className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          🕯️ Умирање
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <Select
            label="Место каде умрел"
            value={formData.death.place}
            onChange={(val) => updateField("death", "place", val)}
            options={PLACES}
            allowCustom={true}
          />

          <DateInputPartial
            label="Датум на умирање"
            value={formData.death.date}
            onChange={(val) => updateField("death", "date", val)}
            error={fieldErrors["death.date.year"]}
            required
          />
        </div>
      </section>

      {/* 3. Датум и место на погреб */}
      <section className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          ⛪ Погреб
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <DateInputPartial
            label="Датум на погреб"
            value={formData.burial.date}
            onChange={(val) => updateField("burial", "date", val)}
          />

          <Select
            label="Место на погреб"
            value={formData.burial.place}
            onChange={(val) => updateField("burial", "place", val)}
            options={PLACES}
            allowCustom={true}
          />
        </div>
      </section>

      {/* 4. Место и дата на раѓање */}
      <section className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          📍 Раѓање
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <Select
            label="Место на раѓање"
            value={formData.deceased.birthPlace}
            onChange={(val) => updateField("deceased", "birthPlace", val)}
            options={PLACES}
            allowCustom={true}
          />

          <DateInput
            label="Дата на раѓање"
            value={formData.deceased.birthDate}
            onChange={(val) => updateField("deceased", "birthDate", val)}
          />
        </div>
      </section>

      {/* 5. Свештеник и исповед */}
      <section className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          ✟ Свештеник и Исповед
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <AutocompleteInput
            label="Свештеник (име и презиме)"
            field="priest"
            type="burial"
            value={formData.burial.priestName}
            onChange={(val) => updateField("burial", "priestName", val)}
          />

          <RadioToggle
            label="Дали се исповедал"
            value={formData.burial.confessed}
            onChange={(val) => updateField("burial", "confessed", val)}
          />
        </div>
      </section>

      {/* 6. Причина за смрт */}
      <section className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          💊 Причина за Смрт
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          <Textarea
            label="Од каква болест или начин на умирање"
            value={formData.death.causeOfDeath}
            onChange={(e) =>
              updateField("death", "causeOfDeath", e.target.value)
            }
            rows={3}
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
