/**
 * RadioToggle компонента за Да/Не избор
 * @param {Object} props
 * @param {string} props.label - Натпис
 * @param {string} props.value - Вредност ("Да" или "Не")
 * @param {Function} props.onChange - Callback за промена
 */
export function RadioToggle({ label, value, onChange }) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <div className="flex gap-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name={label}
            value="Не"
            checked={value === "Не" || value === "" || !value}
            onChange={(e) => onChange(e.target.value)}
            className="w-5 h-5 text-primary-600 border-gray-300 focus:ring-primary-500 cursor-pointer"
          />
          <span className="ml-2 text-base sm:text-sm text-gray-900 dark:text-white">
            Не
          </span>
        </label>

        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name={label}
            value="Да"
            checked={value === "Да"}
            onChange={(e) => onChange(e.target.value)}
            className="w-5 h-5 text-primary-600 border-gray-300 focus:ring-primary-500 cursor-pointer"
          />
          <span className="ml-2 text-base sm:text-sm text-gray-900 dark:text-white">
            Да
          </span>
        </label>
      </div>
    </div>
  );
}
