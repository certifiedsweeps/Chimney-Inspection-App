"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Printer } from "lucide-react";
import { formatDate, inspectionLevelLabel, chimneyTypeLabel, overallConditionLabel } from "@/lib/utils";

type Item = {
  id: string;
  label: string;
  result: string | null;
  notes: string | null;
};

type Section = {
  id: string;
  sectionTitle: string;
  notes: string | null;
  items: Item[];
};

type Company = {
  name: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  licenseNum?: string | null;
  csiaNum?: string | null;
};

type Inspection = {
  id: string;
  inspectionNumber: string;
  status: string;
  inspectionDate: string;
  inspectionLevel: string;
  chimneyType: string;
  technicianName: string | null;
  technicianLicense: string | null;
  propertyAddress: string | null;
  propertyCity: string | null;
  propertyState: string | null;
  propertyZip: string | null;
  applianceMake: string | null;
  applianceModel: string | null;
  applianceSerial: string | null;
  fuelType: string | null;
  applianceType: string | null;
  fireplaceMake: string | null;
  fireplaceModel: string | null;
  fireplaceSerial: string | null;
  flueLinerType: string | null;
  chimneyHeight: string | null;
  overallCondition: string | null;
  summaryNotes: string | null;
  recommendations: string | null;
  customer: { firstName: string; lastName: string; phone: string | null; email: string | null } | null;
  sections: Section[];
};

const RESULT_BADGE: Record<string, { label: string; cls: string }> = {
  pass: { label: "✓ Satisfactory", cls: "text-green-700 bg-green-50 border-green-200" },
  deficient: { label: "✗ Deficient", cls: "text-red-700 bg-red-50 border-red-200" },
  not_applicable: { label: "— N/A", cls: "text-gray-500 bg-gray-50 border-gray-200" },
  not_accessible: { label: "○ Not Accessible", cls: "text-yellow-700 bg-yellow-50 border-yellow-200" },
};

const CONDITION_STYLE: Record<string, string> = {
  satisfactory: "text-green-800 bg-green-50 border-green-300",
  unsatisfactory: "text-red-800 bg-red-50 border-red-300",
  further_evaluation: "text-yellow-800 bg-yellow-50 border-yellow-300",
};

export default function InspectionReport({
  inspection,
  company,
}: {
  inspection: Inspection;
  company: Company | null;
}) {
  const router = useRouter();

  const allItems = inspection.sections.flatMap((s) => s.items);
  const deficientItems = allItems.filter((i) => i.result === "deficient");
  const satisfactoryCount = allItems.filter((i) => i.result === "pass").length;
  const naCount = allItems.filter((i) => i.result === "not_applicable").length;
  const naccessCount = allItems.filter((i) => i.result === "not_accessible").length;

  const propertyLine = [
    inspection.propertyAddress,
    inspection.propertyCity,
    inspection.propertyState,
    inspection.propertyZip,
  ]
    .filter(Boolean)
    .join(", ");

  const equipmentLabel =
    inspection.chimneyType === "masonry"
      ? [inspection.applianceMake, inspection.applianceModel].filter(Boolean).join(" ")
      : [inspection.fireplaceMake, inspection.fireplaceModel].filter(Boolean).join(" ");

  return (
    <>
      {/* Screen-only toolbar */}
      <div className="print:hidden sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm px-6 py-3 flex items-center justify-between">
        <button
          onClick={() => router.push(`/inspections/${inspection.id}`)}
          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-amber-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Inspection
        </button>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Printer className="w-4 h-4" /> Print / Save PDF
        </button>
      </div>

      {/* Report body */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-8 print:p-0 print:max-w-none" id="report">

        {/* Company header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6 md:mb-8 pb-5 md:pb-6 border-b-2 border-amber-700">
          <div>
            <h1 className="text-2xl font-bold text-amber-800">
              {company?.name ?? "Chimney Inspection Services"}
            </h1>
            {company?.address && (
              <p className="text-sm text-gray-600 mt-1">
                {[company.address, company.city, company.state, company.zip].filter(Boolean).join(", ")}
              </p>
            )}
            {company?.phone && <p className="text-sm text-gray-600">{company.phone}</p>}
            {company?.email && <p className="text-sm text-gray-600">{company.email}</p>}
            {company?.licenseNum && (
              <p className="text-xs text-gray-500 mt-1">License: {company.licenseNum}</p>
            )}
            {company?.csiaNum && (
              <p className="text-xs text-gray-500">CSIA #: {company.csiaNum}</p>
            )}
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400 font-mono">{inspection.inspectionNumber}</div>
            <div className="text-sm font-semibold text-gray-700 mt-1">
              CHIMNEY INSPECTION REPORT
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              {inspectionLevelLabel(inspection.inspectionLevel)} · NFPA 211
            </div>
          </div>
        </div>

        {/* Overall condition banner */}
        {inspection.overallCondition && (
          <div
            className={`rounded-lg border px-5 py-4 mb-6 ${
              CONDITION_STYLE[inspection.overallCondition] ?? "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="font-bold text-lg">{overallConditionLabel(inspection.overallCondition)}</div>
            <div className="text-sm mt-0.5 opacity-80">
              {inspection.overallCondition === "unsatisfactory"
                ? "One or more deficiencies were identified. This system should not be operated until the deficiencies noted in this report have been corrected by a qualified professional."
                : inspection.overallCondition === "further_evaluation"
                ? "Conditions were observed that warrant further investigation. A Level III inspection or additional evaluation by a qualified professional is recommended."
                : "No deficiencies were identified. This chimney system appears to be in proper working condition at the time of inspection."}
            </div>
          </div>
        )}

        {/* Two-column info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Customer & Property */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
              Property &amp; Customer
            </h2>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-50">
                {inspection.customer && (
                  <InfoRow
                    label="Customer"
                    value={`${inspection.customer.firstName} ${inspection.customer.lastName}`}
                  />
                )}
                {propertyLine && <InfoRow label="Property" value={propertyLine} />}
                {inspection.customer?.phone && (
                  <InfoRow label="Phone" value={inspection.customer.phone} />
                )}
                {inspection.customer?.email && (
                  <InfoRow label="Email" value={inspection.customer.email} />
                )}
                <InfoRow label="Inspection Date" value={formatDate(inspection.inspectionDate)} />
              </tbody>
            </table>
          </div>

          {/* Chimney & Equipment */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
              Chimney System
            </h2>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-50">
                <InfoRow label="Type" value={chimneyTypeLabel(inspection.chimneyType)} />
                <InfoRow label="Inspection Level" value={inspectionLevelLabel(inspection.inspectionLevel)} />
                {equipmentLabel && <InfoRow label="Appliance/Unit" value={equipmentLabel} />}
                {inspection.fuelType && <InfoRow label="Fuel Type" value={inspection.fuelType.replace(/_/g, " ")} />}
                {inspection.flueLinerType && (
                  <InfoRow label="Flue Liner" value={inspection.flueLinerType.replace(/_/g, " ")} />
                )}
                {inspection.technicianName && (
                  <InfoRow label="Technician" value={inspection.technicianName} />
                )}
                {inspection.technicianLicense && (
                  <InfoRow label="License / CSIA" value={inspection.technicianLicense} />
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inspection statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 md:mb-8">
          {[
            { label: "Items Inspected", value: allItems.filter((i) => i.result).length, cls: "text-gray-800" },
            { label: "Satisfactory", value: satisfactoryCount, cls: "text-green-700" },
            { label: "Deficient", value: deficientItems.length, cls: deficientItems.length > 0 ? "text-red-700" : "text-gray-400" },
            { label: "Not Applicable / Accessible", value: naCount + naccessCount, cls: "text-gray-500" },
          ].map(({ label, value, cls }) => (
            <div key={label} className="border border-gray-100 rounded-lg p-3 text-center">
              <div className={`text-2xl font-bold ${cls}`}>{value}</div>
              <div className="text-xs text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Deficiencies summary (if any) */}
        {deficientItems.length > 0 && (
          <div className="mb-8">
            <h2 className="text-base font-bold text-red-800 mb-3 flex items-center gap-2">
              ⚠ Deficiencies Identified ({deficientItems.length})
            </h2>
            <div className="border border-red-200 rounded-lg overflow-hidden">
              {deficientItems.map((item, idx) => (
                <div
                  key={item.id}
                  className={`px-4 py-3 ${idx < deficientItems.length - 1 ? "border-b border-red-100" : ""} bg-red-50/40`}
                >
                  <p className="text-sm font-medium text-red-900">{item.label}</p>
                  {item.notes && (
                    <p className="text-sm text-red-700 mt-1 leading-relaxed">{item.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed findings by section */}
        <h2 className="text-base font-bold text-gray-800 mb-4">Detailed Inspection Findings</h2>
        <div className="space-y-6 mb-8">
          {inspection.sections.map((section) => {
            const reportItems = section.items.filter((i) => i.result && i.result !== "not_applicable");
            if (reportItems.length === 0) return null;

            return (
              <div key={section.id} className="border border-gray-100 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
                  <h3 className="font-semibold text-sm text-gray-800">{section.sectionTitle}</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {section.items.map((item) => {
                    if (!item.result || item.result === "not_applicable") return null;
                    const badge = RESULT_BADGE[item.result];
                    return (
                      <div key={item.id} className={`px-4 py-3 ${item.result === "deficient" ? "bg-red-50/30" : ""}`}>
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1.5">
                          <p className="text-sm text-gray-700 leading-relaxed flex-1">{item.label}</p>
                          {badge && (
                            <span className={`self-start shrink-0 text-xs px-2 py-0.5 rounded border ${badge.cls}`}>
                              {badge.label}
                            </span>
                          )}
                        </div>
                        {item.notes && (
                          <p className="text-xs text-gray-600 mt-1 italic">{item.notes}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
                {section.notes && (
                  <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-600 italic">
                    {section.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary */}
        {inspection.summaryNotes && (
          <div className="mb-6">
            <h2 className="text-base font-bold text-gray-800 mb-2">Summary of Findings</h2>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap border border-gray-100 rounded-lg p-4 bg-gray-50">
              {inspection.summaryNotes}
            </p>
          </div>
        )}

        {/* Recommendations */}
        {inspection.recommendations && (
          <div className="mb-8">
            <h2 className="text-base font-bold text-gray-800 mb-2">Recommendations</h2>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap border border-amber-100 rounded-lg p-4 bg-amber-50">
              {inspection.recommendations}
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="border-t border-gray-200 pt-4 mt-8">
          <p className="text-xs text-gray-400 leading-relaxed">
            This inspection was conducted in accordance with the standards set forth in NFPA 211,{" "}
            <em>Standard for Chimneys, Fireplaces, Vents, and Solid Fuel–Burning Appliances</em>,
            current edition. This report reflects the visible and accessible conditions of the
            chimney system at the time of inspection only. It does not constitute a warranty or
            guarantee of any kind. Concealed conditions may exist that are beyond the scope of
            this inspection. This report is the property of the company named above and is
            intended solely for the use of the named customer at the property address listed.
          </p>
          <div className="flex justify-between items-center mt-6">
            <div>
              <div className="border-t border-gray-400 w-48 mt-8"></div>
              <p className="text-xs text-gray-500 mt-1">
                Technician Signature: {inspection.technicianName ?? ""}
              </p>
              {inspection.technicianLicense && (
                <p className="text-xs text-gray-500">{inspection.technicianLicense}</p>
              )}
            </div>
            <div className="text-right text-xs text-gray-400">
              <p>Report #{inspection.inspectionNumber}</p>
              <p>{formatDate(inspection.inspectionDate)}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td className="py-1.5 pr-3 text-gray-500 font-medium text-xs whitespace-nowrap align-top">{label}</td>
      <td className="py-1.5 text-gray-800 text-xs">{value}</td>
    </tr>
  );
}
