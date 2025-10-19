import { ChristeningForm } from "@/components/blocks/ChristeningForm";

export default function NovKrstenPage() {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
        Нов запис - Крстениче
      </h1>
      <ChristeningForm />
    </div>
  );
}
