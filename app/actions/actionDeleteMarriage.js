'use server';

import { connectDB } from '@/lib/db';
import Marriage from '@/lib/models/Marriage';
import { revalidatePath } from 'next/cache';

/**
 * Брише запис за венчавање
 * @param {string} id - MongoDB ID
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function deleteMarriage(id) {
  try {
    await connectDB();
    
    const deleted = await Marriage.findByIdAndDelete(id);
    
    if (!deleted) {
      return { 
        success: false, 
        error: 'Записот не е пронајден.' 
      };
    }
    
    // Revalidate
    revalidatePath('/venchani');
    revalidatePath('/dashboard');
    
    return { success: true };
  } catch (error) {
    console.error('Грешка при бришење:', error);
    return { 
      success: false, 
      error: 'Настана грешка при бришење.' 
    };
  }
}

