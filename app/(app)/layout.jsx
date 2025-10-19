import { Sidebar } from "@/components/blocks/Sidebar";
import { MobileNav } from "@/components/blocks/MobileNav";

export default function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Main Content */}
      <main className="flex-1 w-full lg:p-8 p-4 pt-20 pb-20 lg:pt-8 lg:pb-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
