"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { deleteDeath } from "@/app/actions/actionDeleteDeath";

export function DeleteButton({ deathId }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm(
        "Дали сте сигурни дека сакате да го избришете записов? Ова дејство не може да се врати."
      )
    ) {
      return;
    }

    setIsDeleting(true);

    // Show loading toast
    const loadingToast = toast.loading("Се брише записот...");

    const result = await deleteDeath(deathId);

    toast.dismiss(loadingToast);

    if (result.success) {
      toast.success("✅ Записот е успешно избришан!");
      setTimeout(() => {
        router.push("/umreni");
      }, 500);
    } else {
      toast.error("❌ " + (result.error || "Настана грешка"));
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="w-full sm:w-auto bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-5 py-2.5 rounded-lg font-medium disabled:opacity-50 shadow-sm"
    >
      {isDeleting ? "Се брише..." : "Избриши"}
    </button>
  );
}
