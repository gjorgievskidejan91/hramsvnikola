"use client";

import { useState } from "react";
import { Select } from "./Select";

// Мапа на цркви и нивните места
const CHURCH_PLACE_MAP = {
  "Свети Никола": "Кукуречани",
  "Свети Димитрија": "Дихово",
  "Света Богородица": "Трново",
};

const CHURCHES = Object.keys(CHURCH_PLACE_MAP);
const PLACES = ["Кукуречани", "Дихово", "Трново", "Битола"];

/**
 * ChurchPlaceSelect - Селектор за храм и место со auto-populate
 * @param {Object} props
 * @param {string} props.churchValue - Вредност за храм
 * @param {string} props.placeValue - Вредност за место
 * @param {Function} props.onChurchChange - Callback за храм
 * @param {Function} props.onPlaceChange - Callback за место
 * @param {boolean} props.autoPopulate - Дали да автоматски пополнува место (default: true)
 */
export function ChurchPlaceSelect({
  churchValue,
  placeValue,
  onChurchChange,
  onPlaceChange,
  autoPopulate = true,
}) {
  const [autoFill, setAutoFill] = useState(autoPopulate);

  const handleChurchChange = (newChurch) => {
    onChurchChange(newChurch);

    // Ако е вклучено auto-populate и храмот е во мапата
    if (autoFill && CHURCH_PLACE_MAP[newChurch]) {
      onPlaceChange(CHURCH_PLACE_MAP[newChurch]);
    }
  };

  return (
    <>
      {/* Toggle за auto-populate */}
      <div className="col-span-full">
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={autoFill}
            onChange={(e) => setAutoFill(e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span>Автоматски пополни место според храм</span>
        </label>
      </div>

      {/* Храм Select */}
      <Select
        label="Храм"
        value={churchValue}
        onChange={handleChurchChange}
        options={CHURCHES}
        allowCustom={true}
      />

      {/* Место Select */}
      <Select
        label="Место"
        value={placeValue}
        onChange={onPlaceChange}
        options={PLACES}
        allowCustom={true}
      />
    </>
  );
}

// Export за користење надвор
export { CHURCHES, PLACES, CHURCH_PLACE_MAP };
