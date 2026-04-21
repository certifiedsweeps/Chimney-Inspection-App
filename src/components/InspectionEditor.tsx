"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  MinusCircle,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Save,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { formatDate, inspectionLevelLabel, chimneyTypeLabel, statusBadgeClass, overallConditionLabel } from "@/lib/utils";
import { OVERALL_CONDITIONS, resultLabels } from "@/lib/inspectionTemplates";
import type { ItemResult } from "@/lib/inspectionTemplates";

type Item = {
  id: string;
  itemKey: string;
  label: string;
  result: string | null;
  notes: string | null;
  sortOrder: number;
};

type Section = {
  id: string;
  sectionKey: string;
  sectionTitle: string;
  sortOrder: number;
  notes: string | null;
  items: Item[];
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

const RESULT_BUTTONS: { result: ItemResult; label: string; icon: React.ElementType; activeClass: string; inactiveClass: string }[] = [
  {
    result: "pass",
    label: "Satisfactory",
    icon: CheckCircle2,
    activeClass: "bg-green-100 text-green-700 border-green-300 font-medium",
    inactiveClass: "bg-white text-gray-400 border-gray-200 hover:border-green-300 hover:text-green-600",
  },
  {
    result: "deficient",
    label: "Deficient",
    icon: XCircle,
    activeClass: "bg-red-100 text-red-700 border-red-300 font-medium",
    inactiveClass: "bg-white text-gray-400 border-gray-200 hover:border-red-300 hover:text-red-600",
  },
  {
    result: "not_applicable",
    label: "N/A",
    icon: MinusCircle,
    activeClass: "bg-gray-100 text-gray-600 border-gray-400 font-medium",
    inactiveClass: "bg-white text-gray-400 border-gray-200 hover:border-gray-400",
  },
  {
    result: "not_accessible",
    label: "Not Accessible",
    icon: EyeOff,
    activeClass: "bg-yellow-100 text-yellow-700 border-yellow-300 font-medium",
    inactiveClass: "bg-white text-gray-400 border-gray-200 hover:border-yellow-300 hover:text-yellow-600",
  },
];

export default function InspectionEditor({ inspection: initial }: { inspection: Inspection }) {
  const router = useRouter();
  const [inspection, setInspection] = useState<Inspection>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  // ── Derived stats ────────────────────────────────────────────────────────
  const allItems = inspection.sections.flatMap((s) => s.items);
  const answered = allItems.filter((i) => i.result).length;
  const deficient = allItems.filter((i) => i.result === "deficient").length;
  const progress = allItems.length > 0 ? Math.round((answered / allItems.length) * 100) : 0;

  // ── Mutators ─────────────────────────────────────────────────────────────
  const setItemResult = useCallback((sectionId: string, itemId: string, result: ItemResult) => {
    setInspection((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id !== sectionId
          ? s
          : {
              ...s,
              items: s.items.map((i) =>
                i.id !== itemId ? i : { ...i, result }
              ),
            }
      ),
    }));
  }, []);

  const setItemNotes = useCallback((sectionId: string, itemId: string, notes: string) => {
    setInspection((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id !== sectionId
          ? s
          : { ...s, items: s.items.map((i) => (i.id !== itemId ? i : { ...i, notes })) }
      ),
    }));
  }, []);

  const setSectionNotes = useCallback((sectionId: string, notes: string) => {
    setInspection((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id !== sectionId ? s : { ...s, notes })),
    }));
  }, []);

  const setTopLevel = (field: keyof Inspection, value: string) =>
    setInspection((prev) => ({ ...prev, [field]: value }));

  // ── Save ─────────────────────────────────────────────────────────────────
  async function save(markComplete = false) {
    setSaving(true);
    try {
      await fetch(`/api/inspections/${inspection.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: markComplete ? "complete" : inspection.status,
          overallCondition: inspection.overallCondition,
          summaryNotes: inspection.summaryNotes,
          recommendations: inspection.recommendations,
          chimneyHeight: inspection.chimneyHeight,
          sections: inspection.sections,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      if (markComplete) router.refresh();
    } finally {
      setSaving(false);
    }
  }

  const toggleSection = (id: string) =>
    setCollapsedSections((prev) => ({ ...prev, [id]: !prev[id] }));

  const propertyLine = [
    inspection.propertyAddress,
    inspection.propertyCity,
    inspection.propertyState,
    inspection.propertyZip,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <button
        onClick={() => router.push("/inspections")}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-amber-700 mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Inspections
      </button>

      {/* Header card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-gray-400 mb-1">{inspection.inspectionNumber}</div>
            <h1 className="text-xl font-bold text-gray-900">
              {inspection.customer
                ? `${inspection.customer.firstName} ${inspection.customer.lastName}`
                : propertyLine || "Inspection"}
            </h1>
            {propertyLine && (
              <p className="text-sm text-gray-500 mt-0.5">{propertyLine}</p>
            )}
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
              <span>{chimneyTypeLabel(inspection.chimneyType)}</span>
              <span>·</span>
              <span>{inspectionLevelLabel(inspection.inspectionLevel)}</span>
              <span>·</span>
              <span>{formatDate(inspection.inspectionDate)}</span>
              {inspection.technicianName && (
                <>
                  <span>·</span>
                  <span>Tech: {inspection.technicianName}</span>
                </>
              )}
            </div>
          </div>

          {/* Progress + actions */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-xs text-gray-500">
                  {answered}/{allItems.length} items · {deficient > 0 ? (
                    <span className="text-red-600 font-medium">{deficient} deficient</span>
                  ) : (
                    <span className="text-green-600">0 deficiencies</span>
                  )}
                </div>
                <div className="w-36 h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <span className="text-sm font-bold text-amber-700">{progress}%</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => save(false)}
                disabled={saving}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                {saved ? "Saved!" : saving ? "Saving…" : "Save Draft"}
              </button>
              <button
                onClick={() => router.push(`/inspections/${inspection.id}/report`)}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                View Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Checklist sections */}
      <div className="space-y-4">
        {inspection.sections.map((section) => {
          const sectionDeficient = section.items.filter((i) => i.result === "deficient").length;
          const sectionAnswered = section.items.filter((i) => i.result).length;
          const isCollapsed = collapsedSections[section.id];

          return (
            <div key={section.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Section header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <h2 className="font-semibold text-gray-800">{section.sectionTitle}</h2>
                  {sectionDeficient > 0 && (
                    <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">
                      {sectionDeficient} deficient
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">
                    {sectionAnswered}/{section.items.length}
                  </span>
                  {isCollapsed ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </button>

              {!isCollapsed && (
                <div className="border-t border-gray-100">
                  {section.items.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`px-5 py-4 ${idx < section.items.length - 1 ? "border-b border-gray-50" : ""} ${
                        item.result === "deficient" ? "bg-red-50/30" : ""
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                        {/* Label */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 leading-relaxed">{item.label}</p>
                        </div>

                        {/* Result buttons */}
                        <div className="flex gap-1.5 shrink-0 flex-wrap">
                          {RESULT_BUTTONS.map(({ result, label, icon: Icon, activeClass, inactiveClass }) => (
                            <button
                              key={result}
                              onClick={() => setItemResult(section.id, item.id, result)}
                              className={`inline-flex items-center gap-1 text-xs px-2 py-1.5 rounded-md border transition-colors ${
                                item.result === result ? activeClass : inactiveClass
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                              <span className="hidden md:inline">{label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Notes — show if deficient or already has notes */}
                      {(item.result === "deficient" || item.result === "not_accessible" || item.notes) && (
                        <textarea
                          value={item.notes ?? ""}
                          onChange={(e) => setItemNotes(section.id, item.id, e.target.value)}
                          placeholder={
                            item.result === "deficient"
                              ? "Describe the deficiency, location, and recommended corrective action…"
                              : "Notes…"
                          }
                          rows={2}
                          className="mt-2 w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                        />
                      )}
                    </div>
                  ))}

                  {/* Section notes */}
                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Section Notes (optional)
                    </label>
                    <textarea
                      value={section.notes ?? ""}
                      onChange={(e) => setSectionNotes(section.id, e.target.value)}
                      placeholder="General notes for this section…"
                      rows={2}
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none bg-white"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Overall condition & summary */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="font-semibold text-gray-800">Overall Condition & Summary</h2>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Overall Inspection Result
            </label>
            <div className="space-y-2">
              {OVERALL_CONDITIONS.map((cond) => (
                <button
                  key={cond.value}
                  onClick={() => setTopLevel("overallCondition", cond.value)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                    inspection.overallCondition === cond.value
                      ? "border-amber-600 bg-amber-50"
                      : "border-gray-200 hover:border-amber-300"
                  }`}
                >
                  <div className="font-medium text-sm text-gray-900">{cond.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{cond.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Summary of Findings
            </label>
            <textarea
              value={inspection.summaryNotes ?? ""}
              onChange={(e) => setTopLevel("summaryNotes", e.target.value)}
              placeholder="Provide a professional narrative summary of inspection findings…"
              rows={4}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Recommendations
            </label>
            <textarea
              value={inspection.recommendations ?? ""}
              onChange={(e) => setTopLevel("recommendations", e.target.value)}
              placeholder="List recommended corrective actions, repairs, or follow-up inspections…"
              rows={4}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => save(false)}
              disabled={saving}
              className="inline-flex items-center gap-2 text-sm px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saved ? "Saved!" : "Save Draft"}
            </button>
            <button
              onClick={() => save(true)}
              disabled={saving}
              className="inline-flex items-center gap-2 text-sm px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors disabled:opacity-50 font-medium"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark Complete & Save
            </button>
            <button
              onClick={() => router.push(`/inspections/${inspection.id}/report`)}
              className="inline-flex items-center gap-2 text-sm px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              <FileText className="w-4 h-4" />
              View / Print Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
