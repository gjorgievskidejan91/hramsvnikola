"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DateInput } from "@/components/ui/DateInput";
import { AutocompleteInput } from "@/components/ui/AutocompleteInput";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { createChristening } from "@/app/actions/actionCreateChristening";
import { updateChristening } from "@/app/actions/actionUpdateChristening";

/**
 * Форма за крстениче - креирање и измена
 * @param {Object} props
 * @param {Object} props.initialData - Иницијални податоци за измена
 * @param {string} props.christeningId - ID за измена
 */
export function ChristeningForm({ initialData, christeningId }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState(
    initialData || {
      child: {
        firstName: "",
        lastName: "",
        gender: "",
        birthDate: { day: "", month: "", year: "" },
        birthPlace: "Битола",
      },
      father: {
        firstName: "",
        lastName: "",
      },
      mother: {
        firstName: "",
        lastName: "",
        childOrderNumber: "",
      },
      christening: {
        date: { day: "", month: "", year: "" },
        church: "",
        place: "",
        priestName: "",
        godparentFirstName: "",
        godparentLastName: "",
      },
      civillyRegistered: undefined,
      churchMarriage: undefined,
      isTwin: false,
      notes: "",
      pageNumber: "",
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const result = christeningId
        ? await updateChristening(christeningId, formData)
        : await createChristening(formData);

      if (result.success) {
        router.push("/krsteni");
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

      {/* Форма по редослед од книгата */}
      <section className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow">
        <h2 className="text-lg sm:text-xl font-semibold mb-6 text-gray-900 dark:text-white">
          🙏 Книга на Крстени
        </h2>

        <div className="space-y-6">
          {/* 1. Место на раѓање */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Input
              label="Место на раѓање"
              value={formData.child.birthPlace}
              onChange={(e) =>
                updateField("child", "birthPlace", e.target.value)
              }
            />
          </div>

          {/* 2. Датум на раѓање */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <DateInput
              label="Ден, месец и година на раѓање"
              value={formData.child.birthDate}
              onChange={(val) => updateField("child", "birthDate", val)}
            />
          </div>

          {/* 3. Храм и место на крштевање */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Input
              label="Храм на крштевање"
              value={formData.christening.church}
              onChange={(e) =>
                updateField("christening", "church", e.target.value)
              }
            />

            <Input
              label="Место на крштевање"
              value={formData.christening.place}
              onChange={(e) =>
                updateField("christening", "place", e.target.value)
              }
            />
          </div>

          {/* 4. Датум на крштевање */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <DateInput
              label="Ден, месец и година на крштевање"
              value={formData.christening.date}
              onChange={(val) => updateField("christening", "date", val)}
              required
            />
          </div>

          {/* 5. Име на детето и пол */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-base sm:text-lg font-medium mb-4 text-gray-900 dark:text-white">
              Податоци за детето
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Пол <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
                <button
                  type="button"
                  onClick={() => updateField("child", "gender", "Машки")}
                  className={`px-6 py-3 sm:px-8 sm:py-2.5 text-sm font-medium transition-colors ${
                    formData.child.gender === "Машки"
                      ? "bg-primary-600 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  Машки
                </button>
                <button
                  type="button"
                  onClick={() => updateField("child", "gender", "Женски")}
                  className={`px-6 py-3 sm:px-8 sm:py-2.5 text-sm font-medium transition-colors border-l border-gray-300 dark:border-gray-600 ${
                    formData.child.gender === "Женски"
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
                label="Име на детето"
                field="firstName"
                type="child"
                gender={
                  formData.child.gender === "Машки"
                    ? "male"
                    : formData.child.gender === "Женски"
                    ? "female"
                    : undefined
                }
                value={formData.child.firstName}
                onChange={(val) => updateField("child", "firstName", val)}
                required
              />

              <Input
                label="Презиме на детето"
                value={formData.child.lastName}
                onChange={(e) =>
                  updateField("child", "lastName", e.target.value)
                }
              />
            </div>
          </div>

          {/* 6. Родители - Татко и Мајка */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-base sm:text-lg font-medium mb-4 text-gray-900 dark:text-white">
              Родители
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <AutocompleteInput
                label="Име на Татко"
                field="firstName"
                type="father"
                gender="male"
                value={formData.father.firstName}
                onChange={(val) => updateField("father", "firstName", val)}
                required
              />

              <AutocompleteInput
                label="Презиме на Татко"
                field="lastName"
                type="father"
                value={formData.father.lastName}
                onChange={(val) => updateField("father", "lastName", val)}
                required
              />

              <AutocompleteInput
                label="Име на Мајка"
                field="firstName"
                type="mother"
                gender="female"
                value={formData.mother.firstName}
                onChange={(val) => updateField("mother", "firstName", val)}
                required
              />

              <AutocompleteInput
                label="Презиме на Мајка"
                field="lastName"
                type="mother"
                value={formData.mother.lastName}
                onChange={(val) => updateField("mother", "lastName", val)}
                required
              />
            </div>
          </div>

          {/* 7. Свештеник */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <AutocompleteInput
                label="Свештеник (име и презиме)"
                field="priest"
                type="christening"
                value={formData.christening.priestName}
                onChange={(val) =>
                  updateField("christening", "priestName", val)
                }
              />
            </div>
          </div>

          {/* 8. Име и презиме на Кум */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-base sm:text-lg font-medium mb-4 text-gray-900 dark:text-white">
              Кум
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <AutocompleteInput
                label="Име на Кум"
                field="firstName"
                type="godparent"
                gender="male"
                value={formData.christening.godparentFirstName}
                onChange={(val) =>
                  updateField("christening", "godparentFirstName", val)
                }
              />

              <AutocompleteInput
                label="Презиме на Кум"
                field="lastName"
                type="godparent"
                value={formData.christening.godparentLastName}
                onChange={(val) =>
                  updateField("christening", "godparentLastName", val)
                }
              />
            </div>
          </div>

          {/* 9. Граѓански законо */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Дали е детето граѓански законо?
            </label>
            <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, civillyRegistered: true })
                }
                className={`px-6 py-3 sm:px-8 sm:py-2.5 text-sm font-medium transition-colors ${
                  formData.civillyRegistered === true
                    ? "bg-primary-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                Да
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, civillyRegistered: false })
                }
                className={`px-6 py-3 sm:px-8 sm:py-2.5 text-sm font-medium transition-colors border-l border-gray-300 dark:border-gray-600 ${
                  formData.civillyRegistered === false
                    ? "bg-primary-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                Не
              </button>
            </div>
          </div>

          {/* 10. Црковно брачно */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Дали е детето црковно брачно?
            </label>
            <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, churchMarriage: true })
                }
                className={`px-6 py-3 sm:px-8 sm:py-2.5 text-sm font-medium transition-colors ${
                  formData.churchMarriage === true
                    ? "bg-primary-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                Да
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, churchMarriage: false })
                }
                className={`px-6 py-3 sm:px-8 sm:py-2.5 text-sm font-medium transition-colors border-l border-gray-300 dark:border-gray-600 ${
                  formData.churchMarriage === false
                    ? "bg-primary-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                Не
              </button>
            </div>
          </div>

          {/* 11. Кое дете по ред */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <Input
                label="Кое дете по ред е на мајката"
                type="number"
                min="1"
                placeholder="Број..."
                value={formData.mother.childOrderNumber}
                onChange={(e) =>
                  updateField("mother", "childOrderNumber", e.target.value)
                }
              />
            </div>
          </div>

          {/* 12. Дали е близнак */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Дали е близнак?
            </label>
            <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isTwin: false })}
                className={`px-6 py-3 sm:px-8 sm:py-2.5 text-sm font-medium transition-colors ${
                  formData.isTwin === false
                    ? "bg-primary-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                Не
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isTwin: true })}
                className={`px-6 py-3 sm:px-8 sm:py-2.5 text-sm font-medium transition-colors border-l border-gray-300 dark:border-gray-600 ${
                  formData.isTwin === true
                    ? "bg-primary-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                Да
              </button>
            </div>
          </div>

          {/* 13. Забелешка и страна */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-base sm:text-lg font-medium mb-4 text-gray-900 dark:text-white">
              Забелешки и извор
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4">
              <Input
                label="Страна од оригинална книга"
                placeholder="Број на страна..."
                value={formData.pageNumber}
                onChange={(e) =>
                  setFormData({ ...formData, pageNumber: e.target.value })
                }
              />
            </div>

            <Textarea
              label="Забелешка"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={4}
            />
          </div>
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
