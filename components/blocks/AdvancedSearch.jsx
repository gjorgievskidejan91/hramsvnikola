"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DateInput } from "@/components/ui/DateInput";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

/**
 * Advanced Search за венчавања
 * Брзо пребарување по имиња + Date range + Advanced филтри
 */
export function AdvancedSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [filters, setFilters] = useState({
    // Брзо пребарување - имиња и презимиња
    name: searchParams.get("name") || "",

    // Date range
    dateFrom: {
      day: searchParams.get("dateFromDay") || "",
      month: searchParams.get("dateFromMonth") || "",
      year: searchParams.get("dateFromYear") || "",
    },
    dateTo: {
      day: searchParams.get("dateToDay") || "",
      month: searchParams.get("dateToMonth") || "",
      year: searchParams.get("dateToYear") || "",
    },

    // Напредно пребарување
    church: searchParams.get("church") || "",
    place: searchParams.get("place") || "",
    priest: searchParams.get("priest") || "",
    pageNumber: searchParams.get("pageNumber") || "",
  });

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    // Додај name ако има
    if (filters.name.trim()) {
      params.set("name", filters.name.trim());
    }

    // Додај date range
    if (filters.dateFrom.year) {
      params.set("dateFromYear", filters.dateFrom.year);
      if (filters.dateFrom.month)
        params.set("dateFromMonth", filters.dateFrom.month);
      if (filters.dateFrom.day) params.set("dateFromDay", filters.dateFrom.day);
    }

    if (filters.dateTo.year) {
      params.set("dateToYear", filters.dateTo.year);
      if (filters.dateTo.month) params.set("dateToMonth", filters.dateTo.month);
      if (filters.dateTo.day) params.set("dateToDay", filters.dateTo.day);
    }

    // Додај advanced филтри
    if (filters.church) params.set("church", filters.church);
    if (filters.place) params.set("place", filters.place);
    if (filters.priest) params.set("priest", filters.priest);
    if (filters.pageNumber) params.set("pageNumber", filters.pageNumber);

    // Navigate
    const queryString = params.toString();
    router.push(queryString ? `/venchani?${queryString}` : "/venchani");
  };

  const handleClear = () => {
    setFilters({
      name: "",
      dateFrom: { day: "", month: "", year: "" },
      dateTo: { day: "", month: "", year: "" },
      church: "",
      place: "",
      priest: "",
      pageNumber: "",
    });
    router.push("/venchani");
  };

  const hasActiveFilters =
    filters.name ||
    filters.dateFrom.year ||
    filters.dateTo.year ||
    filters.church ||
    filters.place ||
    filters.priest ||
    filters.pageNumber;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
      <form onSubmit={handleSearch} className="space-y-4">
        {/* Брзо пребарување по име/презиме */}
        <div>
          <Input
            label="Пребарај по име или презиме"
            placeholder="Александар, Петковски..."
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          />
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DateInput
            label="Од датум"
            value={filters.dateFrom}
            onChange={(val) => setFilters({ ...filters, dateFrom: val })}
          />
          <DateInput
            label="До датум"
            value={filters.dateTo}
            onChange={(val) => setFilters({ ...filters, dateTo: val })}
          />
        </div>

        {/* Advanced Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
          >
            {showAdvanced ? "▼" : "▶"} Напредно пребарување
          </button>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-200 dark:border-gray-700">
            <Select
              label="Храм"
              value={filters.church}
              onChange={(val) => setFilters({ ...filters, church: val })}
              options={["Свети Никола", "Св. Петка", "Св. Богородица"]}
              allowCustom={true}
            />

            <Select
              label="Место"
              value={filters.place}
              onChange={(val) => setFilters({ ...filters, place: val })}
              options={["Кукуречани"]}
              allowCustom={true}
            />

            <Input
              label="Свештеник"
              placeholder="Име на свештеник..."
              value={filters.priest}
              onChange={(e) =>
                setFilters({ ...filters, priest: e.target.value })
              }
            />

            <Input
              label="Страна од книга"
              type="number"
              placeholder="Број на страна..."
              value={filters.pageNumber}
              onChange={(e) =>
                setFilters({ ...filters, pageNumber: e.target.value })
              }
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <Button type="submit" className="flex-1 sm:flex-none">
            🔍 Пребарај
          </Button>
          {hasActiveFilters && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleClear}
              className="flex-1 sm:flex-none"
            >
              Исчисти
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Активни филтри:
            </span>
            {filters.name && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-sm">
                Име: {filters.name}
              </span>
            )}
            {filters.dateFrom.year && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-sm">
                Од: {filters.dateFrom.day || "?"}/
                {filters.dateFrom.month || "?"}/{filters.dateFrom.year}
              </span>
            )}
            {filters.dateTo.year && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-sm">
                До: {filters.dateTo.day || "?"}/{filters.dateTo.month || "?"}/
                {filters.dateTo.year}
              </span>
            )}
            {filters.church && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-sm">
                Храм: {filters.church}
              </span>
            )}
            {filters.place && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-sm">
                Место: {filters.place}
              </span>
            )}
            {filters.priest && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-sm">
                Свештеник: {filters.priest}
              </span>
            )}
            {filters.pageNumber && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-sm">
                Страна: {filters.pageNumber}
              </span>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
