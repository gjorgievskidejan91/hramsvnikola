"use server";

import { connectDB } from "@/lib/db";
import Marriage from "@/lib/models/Marriage";
import { marriageSchema } from "@/lib/validators/marriageSchema";
import { revalidatePath } from "next/cache";

/**
 * Ажурира постоечки запис за венчавање
 * @param {string} id - MongoDB ID
 * @param {Object} formData - Податоци за венчавање
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function updateMarriage(id, formData) {
  try {
    // Конвертирај празни стрингови во number
    const cleanedData = cleanFormData(formData);

    // Валидација
    const validated = marriageSchema.parse(cleanedData);

    // Поврзи со база
    await connectDB();

    // Ажурирај запис
    const updated = await Marriage.findByIdAndUpdate(
      id,
      { ...validated, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return {
        success: false,
        error: "Записот не е пронајден.",
      };
    }

    // Revalidate
    revalidatePath("/venchani");
    revalidatePath(`/venchani/${id}`);
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Грешка при ажурирање:", error);

    if (error.name === "ZodError") {
      // Parse field errors
      const fieldErrors = {};
      error.errors.forEach((err) => {
        const path = err.path.join(".");
        fieldErrors[path] = err.message;
      });

      return {
        success: false,
        error: "Невалидни податоци. Проверете ги полињата.",
        fieldErrors,
      };
    }

    return {
      success: false,
      error: error.message || "Настана грешка.",
    };
  }
}

function cleanFormData(data) {
  const cleaned = JSON.parse(JSON.stringify(data));

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
