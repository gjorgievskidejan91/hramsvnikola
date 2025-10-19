"use server";

import { connectDB } from "@/lib/db";
import Death from "@/lib/models/Death";
import { deathSchema } from "@/lib/validators/deathSchema";
import { revalidatePath } from "next/cache";

/**
 * Креира нов запис за умрен
 * @param {Object} formData - Податоци за умрен
 * @returns {Promise<{success: boolean, id?: string, error?: string}>}
 */
export async function createDeath(formData) {
  try {
    // Конвертирај празни стрингови во number или undefined
    const cleanedData = cleanFormData(formData);

    // Валидација со Zod
    const validated = deathSchema.parse(cleanedData);

    // Поврзи со база
    await connectDB();

    // Креирај нов запис
    const death = await Death.create(validated);

    // Revalidate страните
    revalidatePath("/umreni");
    revalidatePath("/dashboard");

    return {
      success: true,
      id: death._id.toString(),
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

  // Избриши празни стрингови од deceased (освен birthDate кој се обработува подолу)
  if (cleaned.deceased) {
    Object.keys(cleaned.deceased).forEach((key) => {
      if (key !== "birthDate" && cleaned.deceased[key] === "") {
        delete cleaned.deceased[key];
      }
    });
  }

  // Конвертирај датум на раѓање
  if (cleaned.deceased?.birthDate) {
    const bd = cleaned.deceased.birthDate;
    if (bd.day) bd.day = parseInt(bd.day);
    if (bd.month) bd.month = parseInt(bd.month);
    if (bd.year) bd.year = parseInt(bd.year);

    // Избриши birthDate ако е празен
    if (!bd.day && !bd.month && !bd.year) {
      delete cleaned.deceased.birthDate;
    }
  }

  // Конвертирај датум на смрт
  if (cleaned.death?.date) {
    const dd = cleaned.death.date;
    if (dd.day) dd.day = parseInt(dd.day);
    if (dd.month) dd.month = parseInt(dd.month);
    if (dd.year) dd.year = parseInt(dd.year);
  }

  // Конвертирај датум на погреб
  if (cleaned.burial?.date) {
    const bd = cleaned.burial.date;
    if (bd.day) bd.day = parseInt(bd.day);
    if (bd.month) bd.month = parseInt(bd.month);
    if (bd.year) bd.year = parseInt(bd.year);
  }

  // Конвертирај confessed во boolean
  if (cleaned.burial?.confessed !== undefined) {
    if (
      cleaned.burial.confessed === "true" ||
      cleaned.burial.confessed === true
    ) {
      cleaned.burial.confessed = true;
    } else if (
      cleaned.burial.confessed === "false" ||
      cleaned.burial.confessed === false
    ) {
      cleaned.burial.confessed = false;
    } else {
      delete cleaned.burial.confessed;
    }
  }

  // Конвертирај pageNumber
  if (cleaned.pageNumber && cleaned.pageNumber !== "") {
    cleaned.pageNumber = parseInt(cleaned.pageNumber);
  } else {
    delete cleaned.pageNumber;
  }

  return cleaned;
}
