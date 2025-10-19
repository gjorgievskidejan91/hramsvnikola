/**
 * Button компонента
 * @param {Object} props
 * @param {'primary'|'secondary'|'danger'} props.variant - Стил на копче
 */
export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const variants = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white",
    secondary:
      "bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <button
      className={`px-6 py-3 sm:px-4 sm:py-2 rounded-lg sm:rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
