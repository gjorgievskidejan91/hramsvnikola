"use server";

import { connectDB } from "@/lib/db";
import Death from "@/lib/models/Death";
import { revalidatePath } from "next/cache";

/**
 * Бриши запис за умрен
 * @param {string} id - ID на записот
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function deleteDeath(id) {
  try {
    await connectDB();

    const death = await Death.findByIdAndDelete(id);

    if (!death) {
      return {
        success: false,
        error: "Записот не е пронајден.",
      };
    }

    // Revalidate страните
    revalidatePath("/umreni");
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
