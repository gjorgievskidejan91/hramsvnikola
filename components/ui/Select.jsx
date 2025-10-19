"use client";

import { useState } from "react";

/**
 * Select компонента со опција за custom вредност
 * @param {Object} props
 * @param {string} props.label - Натпис
 * @param {string} props.value - Тековна вредност
 * @param {Function} props.onChange - Callback за промена
 * @param {Array} props.options - Листа на опции ["Option 1", "Option 2"] или [{value: "val", label: "Label"}]
 * @param {boolean} props.allowCustom - Дозволи custom вредност
 * @param {string} props.error - Порака за грешка
 * @param {boolean} props.required - Задолжително поле
 */
export function Select({
  label,
  value,
  onChange,
  options = [],
  allowCustom = true,
  error,
  required,
}) {
  // Normalize options to handle both string and object formats
  const normalizedOptions = options.map((opt) =>
    typeof opt === "object" && opt !== null
      ? { value: opt.value, label: opt.label }
      : { value: opt, label: opt }
  );

  const optionValues = normalizedOptions.map((opt) => opt.value);
  const isCustomValue = value && !optionValues.includes(value);
  const [showCustom, setShowCustom] = useState(isCustomValue);

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;

    if (selectedValue === "__custom__") {
      setShowCustom(true);
      onChange(""); // Clear value to allow typing
    } else {
      setShowCustom(false);
      // Convert "true"/"false" strings to booleans if needed
      if (selectedValue === "true") {
        onChange(true);
      } else if (selectedValue === "false") {
        onChange(false);
      } else {
        onChange(selectedValue);
      }
    }
  };

  const handleCustomInputChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {!showCustom ? (
        <select
          value={
            value === true ? "true" : value === false ? "false" : value || ""
          }
          onChange={handleSelectChange}
          className={`w-full px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm border rounded-lg sm:rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 ${
            error
              ? "border-red-500 dark:border-red-500"
              : "border-gray-300 dark:border-gray-600"
          }`}
        >
          <option value="">Избери...</option>
          {normalizedOptions.map((option) => (
            <option key={String(option.value)} value={String(option.value)}>
              {option.label}
            </option>
          ))}
          {allowCustom && <option value="__custom__">Друго...</option>}
        </select>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={handleCustomInputChange}
            placeholder="Внеси вредност..."
            className={`flex-1 px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm border rounded-lg sm:rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 ${
              error
                ? "border-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          />
          <button
            type="button"
            onClick={() => {
              setShowCustom(false);
              onChange(options[0] || "");
            }}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            Откажи
          </button>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
