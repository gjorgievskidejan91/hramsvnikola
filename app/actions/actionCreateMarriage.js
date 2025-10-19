"use server";

import { connectDB } from "@/lib/db";
import Marriage from "@/lib/models/Marriage";
import { marriageSchema } from "@/lib/validators/marriageSchema";
import { revalidatePath } from "next/cache";

/**
 * Креира нов запис за венчавање
 * @param {Object} formData - Податоци за венчавање
 * @returns {Promise<{success: boolean, id?: string, error?: string}>}
 */
export async function createMarriage(formData) {
  try {
    // Конвертирај празни стрингови во number или undefined
    const cleanedData = cleanFormData(formData);

    // Валидација со Zod
    const validated = marriageSchema.parse(cleanedData);

    // Поврзи со база
    await connectDB();

    // Креирај нов запис
    const marriage = await Marriage.create(validated);

    // Revalidate страните
    revalidatePath("/venchani");
    revalidatePath("/dashboard");

    return {
      success: true,
      id: marriage._id.toString(),
    };
  } catch (error) {
    console.error("Грешка при креирање:", error);

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

  // Конвертирај датуми
  ["groom", "bride"].forEach((person) => {
    if (cleaned[person]?.birthDate) {
      const bd = cleaned[person].birthDate;
      if (bd.day) bd.day = parseInt(bd.day);
      if (bd.month) bd.month = parseInt(bd.month);
      if (bd.year) bd.year = parseInt(bd.year);
    }
    if (cleaned[person]?.marriageNumber) {
      cleaned[person].marriageNumber = parseInt(cleaned[person].marriageNumber);
    }
  });

  // Конвертирај датум на венчавање
  if (cleaned.marriage?.date) {
    const md = cleaned.marriage.date;
    if (md.day) md.day = parseInt(md.day);
    if (md.month) md.month = parseInt(md.month);
    if (md.year) md.year = parseInt(md.year);
  }

  // Конвертирај pageNumber
  if (cleaned.pageNumber && cleaned.pageNumber !== "") {
    cleaned.pageNumber = parseInt(cleaned.pageNumber);
  } else {
    // Избриши го ако е празен string
    delete cleaned.pageNumber;
  }

  return cleaned;
}
