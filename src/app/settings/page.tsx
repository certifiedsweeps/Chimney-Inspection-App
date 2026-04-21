import { prisma } from "@/lib/prisma";
import CompanySettingsForm from "@/components/CompanySettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const company = await prisma.company.findFirst();

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Settings</h1>
      <p className="text-gray-500 text-sm mb-8">
        Company information appears on all printed reports.
      </p>
      <CompanySettingsForm company={company ? JSON.parse(JSON.stringify(company)) : null} />
    </div>
  );
}
