"use server";

import { connectDB } from "@/lib/db";
import Christening from "@/lib/models/Christening";
import { revalidatePath } from "next/cache";

/**
 * Избриши запис за крстениче
 * @param {string} id - MongoDB ID
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function deleteChristening(id) {
  try {
    await connectDB();

    const christening = await Christening.findByIdAndDelete(id);

    if (!christening) {
      return {
        success: false,
        error: "Записот не е пронајден.",
      };
    }

    // Revalidate страните
    revalidatePath("/krsteni");
    revalidatePath("/dashboard");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Грешка при бришење:", error);
    return {
      success: false,
      error: error.message || "Настана грешка при бришење.",
    };
  }
}
