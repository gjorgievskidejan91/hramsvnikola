"use client";

import { useRef } from "react";

/**
 * DateInputPartial компонента за внесување датуми
 * Дозволува парцијални датуми (само година, или година+месец)
 * @param {Object} props
 * @param {string} props.label - Натпис
 * @param {Object} props.value - Вредност {day, month, year}
 * @param {Function} props.onChange - Callback за промена
 * @param {string} props.error - Порака за грешка
 * @param {boolean} props.required - Задолжително поле
 * @param {boolean} props.yearOnly - Дозволи само година (optional)
 */
export function DateInputPartial({
  label,
  value = {},
  onChange,
  error,
  required,
  yearOnly = false,
}) {
  const dayRef = useRef(null);
  const monthRef = useRef(null);
  const yearRef = useRef(null);

  const { day = "", month = "", year = "" } = value;

  // Ажурирај ден и префрли на месец
  const handleDayChange = (e) => {
    const val = e.target.value.replace(/\D/g, "");

    if (val.length <= 2) {
      onChange({ ...value, day: val });

      // Автоматско префрлање на месец кога внесеш 2 цифри
      if (val.length === 2) {
        const numVal = parseInt(val) || 0;
        if (numVal >= 1 && numVal <= 31) {
          monthRef.current?.focus();
        }
      }
    }
  };

  const handleMonthChange = (e) => {
    const val = e.target.value.replace(/\D/g, "");

    if (val.length <= 2) {
      onChange({ ...value, month: val });

      // Автоматско префрлање на година кога внесеш 2 цифри
      if (val.length === 2) {
        const numVal = parseInt(val) || 0;
        if (numVal >= 1 && numVal <= 12) {
          yearRef.current?.focus();
        }
      }
    }
  };

  const handleYearChange = (e) => {
    const val = e.target.value.replace(/\D/g, "");

    if (val.length <= 4) {
      onChange({ ...value, year: val });
    }
  };

  // Backspace навраќа на претходното поле
  const handleMonthKeyDown = (e) => {
    if (e.key === "Backspace" && month === "") {
      dayRef.current?.focus();
    }
  };

  const handleYearKeyDown = (e) => {
    if (e.key === "Backspace" && year === "") {
      monthRef.current?.focus();
    }
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="flex items-center gap-2">
        {/* Ден */}
        {!yearOnly && (
          <>
            <input
              ref={dayRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="ДД"
              value={day}
              onChange={handleDayChange}
              maxLength={2}
              className={`w-16 sm:w-14 px-2 sm:px-3 py-3 sm:py-2 text-base sm:text-sm text-center border rounded-lg sm:rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 ${
                error
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              aria-label="Ден"
            />

            <span className="text-gray-400">/</span>

            {/* Месец */}
            <input
              ref={monthRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="ММ"
              value={month}
              onChange={handleMonthChange}
              onKeyDown={handleMonthKeyDown}
              maxLength={2}
              className={`w-16 sm:w-14 px-2 sm:px-3 py-3 sm:py-2 text-base sm:text-sm text-center border rounded-lg sm:rounded-md focus:ring-2 focus:border-transparent ${
                error
                  ? "border-red-500 bg-red-50 dark:bg-red-900/10 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-primary-500"
              }`}
              aria-label="Месец"
            />

            <span className="text-gray-400">/</span>
          </>
        )}

        {/* Година */}
        <input
          ref={yearRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="ГГГГ"
          value={year}
          onChange={handleYearChange}
          onKeyDown={handleYearKeyDown}
          maxLength={4}
          className={`w-20 sm:w-18 px-2 sm:px-3 py-3 sm:py-2 text-base sm:text-sm text-center border rounded-lg sm:rounded-md focus:ring-2 focus:border-transparent ${
            error
              ? "border-red-500 bg-red-50 dark:bg-red-900/10 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-primary-500"
          }`}
          aria-label="Година"
        />
      </div>

      {/* Helper text */}
      {!yearOnly && !error && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Ден и месец се опционални. Можете да внесете само година.
        </p>
      )}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 font-medium">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}
