import { prisma } from "@/lib/prisma";
import { requireCompanyId } from "@/lib/auth";
import Link from "next/link";
import { ClipboardList, Users, CheckCircle2, AlertCircle, PlusCircle, ArrowRight } from "lucide-react";
import { formatDate, inspectionLevelLabel, chimneyTypeLabel, statusBadgeClass, overallConditionLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const companyId = await requireCompanyId();

  const [inspections, customerCount] = await Promise.all([
    prisma.inspection.findMany({
      where: { companyId },
      include: { customer: true },
      orderBy: { inspectionDate: "desc" },
      take: 10,
    }),
    prisma.customer.count({ where: { companyId } }),
  ]);

  const total = await prisma.inspection.count({ where: { companyId } });
  const satisfactory = inspections.filter((i) => i.overallCondition === "satisfactory").length;
  const deficient = inspections.filter((i) => i.overallCondition === "unsatisfactory").length;
  const drafts = inspections.filter((i) => i.status === "draft").length;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Professional chimney inspection reports — NFPA 211 / CSIA compliant
          </p>
        </div>
        <Link
          href="/inspections/new"
          className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          New Inspection
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Inspections", value: total, icon: ClipboardList, color: "text-amber-700 bg-amber-50" },
          { label: "Customers", value: customerCount, icon: Users, color: "text-blue-700 bg-blue-50" },
          { label: "Satisfactory", value: satisfactory, icon: CheckCircle2, color: "text-green-700 bg-green-50" },
          { label: "Deficiencies Found", value: deficient, icon: AlertCircle, color: "text-red-700 bg-red-50" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className={`inline-flex p-2 rounded-lg ${color} mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Recent Inspections</h2>
          <Link href="/inspections" className="text-sm text-amber-700 hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {inspections.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400">
            <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No inspections yet.</p>
            <Link href="/inspections/new" className="text-amber-700 text-sm hover:underline mt-2 inline-block">
              Create your first inspection →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {inspections.map((insp) => (
              <Link key={insp.id} href={`/inspections/${insp.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-amber-50/50 transition-colors"
              >
                <div className="min-w-0">
                  <div className="text-xs font-mono text-gray-400">{insp.inspectionNumber}</div>
                  <div className="font-medium text-gray-900 text-sm">
                    {insp.customer ? `${insp.customer.firstName} ${insp.customer.lastName}` : insp.propertyAddress || "—"}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {chimneyTypeLabel(insp.chimneyType)} · {inspectionLevelLabel(insp.inspectionLevel)}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  {insp.overallCondition && (
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusBadgeClass(insp.overallCondition)}`}>
                      {overallConditionLabel(insp.overallCondition)}
                    </span>
                  )}
                  {insp.status === "draft" && (
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500 font-medium">Draft</span>
                  )}
                  <div className="text-xs text-gray-400">{formatDate(insp.inspectionDate)}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {drafts > 0 && (
          <div className="px-6 py-3 bg-amber-50 border-t border-amber-100 rounded-b-xl">
            <p className="text-xs text-amber-700">📋 You have {drafts} draft inspection{drafts > 1 ? "s" : ""} in progress.</p>
          </div>
        )}
      </div>
    </div>
  );
}
