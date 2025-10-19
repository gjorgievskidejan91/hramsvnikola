"use server";

import { connectDB } from "@/lib/db";
import Christening from "@/lib/models/Christening";
import { christeningSchema } from "@/lib/validators/christeningSchema";
import { revalidatePath } from "next/cache";

/**
 * Ажурира постоечки запис за крстениче
 * @param {string} id - MongoDB ID
 * @param {Object} formData - Податоци за крстениче
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function updateChristening(id, formData) {
  try {
    // Конвертирај празни стрингови во number или undefined
    const cleanedData = cleanFormData(formData);

    // Валидација со Zod
    const validated = christeningSchema.parse(cleanedData);

    // Поврзи со база
    await connectDB();

    // Ажурирај запис
    const christening = await Christening.findByIdAndUpdate(id, validated, {
      new: true,
      runValidators: true,
    });

    if (!christening) {
      return {
        success: false,
        error: "Записот не е пронајден.",
      };
    }

    // Revalidate страните
    revalidatePath("/krsteni");
    revalidatePath(`/krsteni/${id}`);
    revalidatePath("/dashboard");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Грешка при ажурирање:", error);

    if (error.name === "ZodError") {
      return {
        success: false,
        error: "Невалидни податоци. Проверете ги полињата.",
      };
    }

    return {
      success: false,
      error: error.message || "Настана грешка при зачувување.",
    };
  }
}

/**
 * Чисти празни стрингови и конвертира во бројки
 */
function cleanFormData(data) {
  const cleaned = JSON.parse(JSON.stringify(data));

  // Конвертирај датум на раѓање
  if (cleaned.child?.birthDate) {
    const bd = cleaned.child.birthDate;
    if (bd.day) bd.day = parseInt(bd.day);
    if (bd.month) bd.month = parseInt(bd.month);
    if (bd.year) bd.year = parseInt(bd.year);

    // Избриши birthDate ако е празен
    if (!bd.day && !bd.month && !bd.year) {
      delete cleaned.child.birthDate;
    }
  }

  // Конвертирај датум на крштевање
  if (cleaned.christening?.date) {
    const cd = cleaned.christening.date;
    if (cd.day) cd.day = parseInt(cd.day);
    if (cd.month) cd.month = parseInt(cd.month);
    if (cd.year) cd.year = parseInt(cd.year);
  }

  // Конвертирај childOrderNumber
  if (
    cleaned.mother?.childOrderNumber &&
    cleaned.mother.childOrderNumber !== ""
  ) {
    cleaned.mother.childOrderNumber = parseInt(cleaned.mother.childOrderNumber);
  } else if (cleaned.mother) {
    delete cleaned.mother.childOrderNumber;
  }

  // Конвертирај boolean полиња
  if (cleaned.civillyRegistered !== undefined) {
    cleaned.civillyRegistered =
      cleaned.civillyRegistered === "true" ||
      cleaned.civillyRegistered === true;
  }

  if (cleaned.churchMarriage !== undefined) {
    cleaned.churchMarriage =
      cleaned.churchMarriage === "true" || cleaned.churchMarriage === true;
  }

  if (cleaned.isTwin !== undefined) {
    cleaned.isTwin = cleaned.isTwin === "true" || cleaned.isTwin === true;
  }

  return cleaned;
}
