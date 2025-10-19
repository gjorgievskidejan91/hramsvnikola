"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteChristening } from "@/app/actions/actionDeleteChristening";

export function DeleteButton({ christeningId }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteChristening(christeningId);

      if (result.success) {
        router.push("/krsteni");
      } else {
        alert(result.error || "Настана грешка при бришење.");
      }
    } catch (error) {
      alert("Настана грешка при бришење.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!showConfirm) {
    return (
      <button
        onClick={() => setShowConfirm(true)}
        className="w-full sm:w-auto bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm"
      >
        Избриши
      </button>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-4 py-2.5 rounded-lg font-medium shadow-sm disabled:opacity-50 text-sm"
      >
        {isDeleting ? "Се брише..." : "Потврди"}
      </button>
      <button
        onClick={() => setShowConfirm(false)}
        disabled={isDeleting}
        className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-2.5 rounded-lg font-medium shadow-sm text-sm"
      >
        Откажи
      </button>
    </div>
  );
}
