import { prisma } from "@/lib/prisma";
import { requireCompanyId } from "@/lib/auth";
import Link from "next/link";
import { PlusCircle, ClipboardList } from "lucide-react";
import { formatDate, inspectionLevelLabel, chimneyTypeLabel, statusBadgeClass, overallConditionLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function InspectionsPage() {
  const companyId = await requireCompanyId();
  const inspections = await prisma.inspection.findMany({
    where: { companyId },
    include: { customer: true },
    orderBy: { inspectionDate: "desc" },
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inspections</h1>
        <Link href="/inspections/new"
          className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <PlusCircle className="w-4 h-4" /> New Inspection
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        {inspections.length === 0 ? (
          <div className="px-6 py-16 text-center text-gray-400">
            <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">No inspections yet</p>
            <Link href="/inspections/new" className="text-amber-700 text-sm hover:underline mt-2 inline-block">
              Create your first inspection →
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-12 px-6 py-3 border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wide">
              <div className="col-span-2">Number</div>
              <div className="col-span-3">Customer / Address</div>
              <div className="col-span-2">Type / Level</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Condition</div>
              <div className="col-span-1">Status</div>
            </div>
            <div className="divide-y divide-gray-50">
              {inspections.map((insp) => (
                <Link key={insp.id} href={`/inspections/${insp.id}`}
                  className="grid grid-cols-12 px-6 py-4 hover:bg-amber-50/40 transition-colors items-center"
                >
                  <div className="col-span-2 text-xs font-mono text-gray-500">{insp.inspectionNumber}</div>
                  <div className="col-span-3">
                    <div className="font-medium text-sm text-gray-900">
                      {insp.customer ? `${insp.customer.firstName} ${insp.customer.lastName}` : "—"}
                    </div>
                    <div className="text-xs text-gray-400 truncate">{insp.propertyAddress}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-xs text-gray-700">{chimneyTypeLabel(insp.chimneyType)}</div>
                    <div className="text-xs text-gray-400">{inspectionLevelLabel(insp.inspectionLevel)}</div>
                  </div>
                  <div className="col-span-2 text-sm text-gray-600">{formatDate(insp.inspectionDate)}</div>
                  <div className="col-span-2">
                    {insp.overallCondition ? (
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusBadgeClass(insp.overallCondition)}`}>
                        {overallConditionLabel(insp.overallCondition)}
                      </span>
                    ) : <span className="text-xs text-gray-400">—</span>}
                  </div>
                  <div className="col-span-1">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${insp.status === "complete" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {insp.status === "complete" ? "Complete" : "Draft"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
