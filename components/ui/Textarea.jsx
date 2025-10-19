/**
 * Textarea компонента
 * @param {Object} props
 * @param {string} props.label - Натпис
 * @param {string} props.error - Порака за грешка
 */
export function Textarea({ label, error, className = "", ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm border rounded-lg sm:rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 resize-y min-h-[100px] ${
          error
            ? "border-red-500 dark:border-red-500"
            : "border-gray-300 dark:border-gray-600"
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
