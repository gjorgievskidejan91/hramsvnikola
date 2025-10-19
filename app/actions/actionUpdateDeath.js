"use server";

import { connectDB } from "@/lib/db";
import Death from "@/lib/models/Death";
import { deathSchema } from "@/lib/validators/deathSchema";
import { revalidatePath } from "next/cache";

/**
 * Ажурира постоечки запис за умрен
 * @param {string} id - ID на записот
 * @param {Object} formData - Податоци за умрен
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function updateDeath(id, formData) {
  try {
    // Конвертирај празни стрингови во number или undefined
    const cleanedData = cleanFormData(formData);

    // Валидација со Zod
    const validated = deathSchema.parse(cleanedData);

    // Поврзи со база
    await connectDB();

    // Најди постоечки запис
    const existingDeath = await Death.findById(id);
    if (!existingDeath) {
      return {
        success: false,
        error: "Записот не е пронајден.",
      };
    }

    // Ажурирај ги полињата - ако полето недостасува во validated, постави на undefined
    const fieldsToCheck = [
      "firstName",
      "fatherName",
      "lastName",
      "profession",
      "maritalStatus",
      "religion",
      "gender",
      "birthPlace",
    ];
    fieldsToCheck.forEach((field) => {
      if (validated.deceased && validated.deceased.hasOwnProperty(field)) {
        existingDeath.deceased[field] = validated.deceased[field];
      } else if (!validated.deceased || !(field in validated.deceased)) {
        existingDeath.deceased[field] = undefined;
      }
    });

    // Ажурирај birthDate
    if (validated.deceased?.birthDate) {
      existingDeath.deceased.birthDate = validated.deceased.birthDate;
    }

    // Ажурирај death
    if (validated.death) {
      existingDeath.death = validated.death;
    }

    // Ажурирај burial
    if (validated.burial) {
      existingDeath.burial = validated.burial;
    }

    // Ажурирај notes и pageNumber
    if ("notes" in validated) existingDeath.notes = validated.notes;
    if ("pageNumber" in validated)
      existingDeath.pageNumber = validated.pageNumber;

    // Зачувај
    const death = await existingDeath.save({ validateBeforeSave: false });

    if (!death) {
      return {
        success: false,
        error: "Записот не е пронајден.",
      };
    }

    // Revalidate страните
    revalidatePath("/umreni");
    revalidatePath(`/umreni/${id}`);
    revalidatePath("/dashboard");

    return {
      success: true,
    };
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

  // Confessed остануваат како стринг "Да" или "Не"
  // (не се конвертираат во boolean)

  // Конвертирај pageNumber
  if (cleaned.pageNumber && cleaned.pageNumber !== "") {
    cleaned.pageNumber = parseInt(cleaned.pageNumber);
  } else {
    delete cleaned.pageNumber;
  }

  return cleaned;
}
