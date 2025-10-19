import { DeathForm } from "@/components/blocks/DeathForm";

export default function NovUmrenPage() {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
        Нов запис - Умрен
      </h1>
      <DeathForm />
    </div>
  );
}
