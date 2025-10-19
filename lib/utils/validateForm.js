/**
 * Парсира Zod грешки и ги конвертира во објект со field paths
 * @param {Object} error - ZodError објект
 * @returns {Object} - Мапа од field path до error message
 */
export function parseZodErrors(error) {
  const errors = {};

  if (error?.errors) {
    error.errors.forEach((err) => {
      const path = err.path.join(".");
      errors[path] = err.message;
    });
  }

  return errors;
}

/**
 * Проверува дали field има грешка
 * @param {Object} errors - Објект со грешки
 * @param {string} path - Field path (e.g., "groom.firstName")
 * @returns {string|undefined} - Error message или undefined
 */
export function getFieldError(errors, path) {
  return errors?.[path];
}
