"use client";

import { useState, useEffect, useRef } from "react";

/**
 * AutocompleteInput компонента со autocomplete од база
 * @param {Object} props
 * @param {string} props.label - Натпис
 * @param {string} props.value - Тековна вредност
 * @param {Function} props.onChange - Callback за промена
 * @param {string} props.field - Поле за пребарување (firstName, lastName, fatherName)
 * @param {string} props.type - Тип (groom, bride, marriage)
 * @param {string} props.gender - Пол (male, female) - само за firstName
 * @param {string} props.error - Порака за грешка
 * @param {boolean} props.required - Задолжително поле
 */
export function AutocompleteInput({
  label,
  value,
  onChange,
  field,
  type,
  gender,
  error,
  required,
  ...props
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [justSelected, setJustSelected] = useState(false);
  const [hasUserTyped, setHasUserTyped] = useState(false);
  const wrapperRef = useRef(null);
  const initialValueRef = useRef(value);

  // Debounced API повик за autocomplete
  useEffect(() => {
    // Не прави API повик ако корисникот токму избра suggestion
    if (justSelected) {
      setJustSelected(false);
      return;
    }

    // Не прави API повик ако корисникот не почнал да пишува
    // (спречува autocomplete при initial load со pre-filled вредности)
    if (!hasUserTyped && value === initialValueRef.current) {
      return;
    }

    const fetchSuggestions = async () => {
      if (value && value.length >= 2) {
        setIsLoading(true);
        try {
          // Изгради URL со параметри
          let url = `/api/autocomplete/names?q=${encodeURIComponent(
            value
          )}&field=${field}`;

          // Додај gender за firstName И fatherName
          if ((field === "firstName" || field === "fatherName") && gender) {
            url += `&gender=${gender}`;
          }

          const res = await fetch(url);
          const data = await res.json();

          // Не прикажувај suggestions ако вредноста точно одговара на некој suggestion
          if (
            data.length > 0 &&
            !data.some((s) => s.toLowerCase() === value.toLowerCase())
          ) {
            setSuggestions(data);
            setShowSuggestions(true);
          } else if (
            data.length > 0 &&
            data.some((s) => s.toLowerCase() === value.toLowerCase())
          ) {
            // Ако вредноста е точно иста како suggestion, не прикажувај dropdown
            setSuggestions([]);
            setShowSuggestions(false);
          } else {
            setSuggestions(data);
            setShowSuggestions(true);
          }
        } catch (error) {
          console.error("Грешка при autocomplete:", error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300); // 300ms debounce
    return () => clearTimeout(timer);
  }, [value, field, gender, justSelected]);

  // Затвори dropdown кога кликнеш надвор
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setHasUserTyped(true); // Означи дека корисникот почнал да пишува
            onChange(e.target.value);
          }}
          onFocus={() => setHasUserTyped(true)} // Означи кога фокусира
          autoComplete="off"
          className={`w-full px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm border rounded-lg sm:rounded-md focus:ring-2 focus:border-transparent bg-white dark:bg-gray-800 ${
            error
              ? "border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/10 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600 focus:ring-primary-500"
          }`}
          aria-invalid={error ? "true" : "false"}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">
            ⚠️ {error}
          </p>
        )}
      </div>

      {/* Dropdown со suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              className="w-full text-left px-4 py-3 sm:py-2 text-base sm:text-sm hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 cursor-pointer transition-colors"
              onClick={() => {
                setJustSelected(true); // Спречи нов API повик
                onChange(suggestion);
                setShowSuggestions(false);
                setSuggestions([]);
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Loading индикатор */}
      {isLoading && value.length >= 2 && (
        <div className="absolute right-3 top-9 text-gray-400">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}
    </div>
  );
}
