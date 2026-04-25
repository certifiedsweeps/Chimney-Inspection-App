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
import {
  formatDate,
  inspectionLevelLabel,
  chimneyTypeLabel,
  statusBadgeClass,
  overallConditionLabel,
} from "@/lib/utils";
import { OVERALL_CONDITIONS } from "@/lib/inspectionTemplates";
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
  flueWidth: string | null;
  flueHeight: string | null;
  chimneyHeight: string | null;
  overallCondition: string | null;
  summaryNotes: string | null;
  recommendations: string | null;
  // Sweep-only
  internalNotes: string | null;
  roofAccess: string | null;
  fireplaceOpeningWidth: string | null;
  fireplaceOpeningHeight: string | null;
  companyCamUrl: string | null;
  customer: { firstName: string; lastName: string; phone: string | null; email: string | null } | null;
  sections: Section[];
};

// Mobile-friendly result buttons — icon + short label
const RESULT_BUTTONS: {
  result: ItemResult;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  activeClass: string;
  inactiveClass: string;
}[] = [
  {
    result: "pass",
    label: "Satisfactory",
    shortLabel: "OK",
    icon: CheckCircle2,
    activeClass: "bg-green-100 text-green-700 border-green-300 font-medium",
    inactiveClass: "bg-white text-gray-400 border-gray-200 hover:border-green-300 hover:text-green-600",
  },
  {
    result: "deficient",
    label: "Deficient",
    shortLabel: "Deficient",
    icon: XCircle,
    activeClass: "bg-red-100 text-red-700 border-red-300 font-medium",
    inactiveClass: "bg-white text-gray-400 border-gray-200 hover:border-red-300 hover:text-red-600",
  },
  {
    result: "not_applicable",
    label: "N/A",
    shortLabel: "N/A",
    icon: MinusCircle,
    activeClass: "bg-gray-100 text-gray-600 border-gray-400 font-medium",
    inactiveClass: "bg-white text-gray-400 border-gray-200 hover:border-gray-400",
  },
  {
    result: "not_accessible",
    label: "Not Accessible",
    shortLabel: "No Access",
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

  const allItems = inspection.sections.flatMap((s) => s.items);
  // "Reviewed" = actively assessed (pass, deficient, not_accessible). N/A is the default and doesn't count toward progress.
  const reviewed = allItems.filter((i) => i.result && i.result !== "not_applicable").length;
  const deficient = allItems.filter((i) => i.result === "deficient").length;
  const progress = allItems.length > 0 ? Math.round((reviewed / allItems.length) * 100) : 0;

  const setItemResult = useCallback((sectionId: string, itemId: string, result: ItemResult) => {
    setInspection((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id !== sectionId ? s : {
          ...s,
          items: s.items.map((i) => i.id !== itemId ? i : { ...i, result }),
        }
      ),
    }));
  }, []);

  const setItemNotes = useCallback((sectionId: string, itemId: string, notes: string) => {
    setInspection((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id !== sectionId ? s : {
          ...s,
          items: s.items.map((i) => i.id !== itemId ? i : { ...i, notes }),
        }
      ),
    }));
  }, []);

  const setSectionNotes = useCallback((sectionId: string, notes: string) => {
    setInspection((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => s.id !== sectionId ? s : { ...s, notes }),
    }));
  }, []);

  const setTopLevel = (field: keyof Inspection, value: string) =>
    setInspection((prev) => ({ ...prev, [field]: value }));

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
          // Sweep-only fields
          internalNotes: inspection.internalNotes,
          roofAccess: inspection.roofAccess,
          fireplaceOpeningWidth: inspection.fireplaceOpeningWidth,
          fireplaceOpeningHeight: inspection.fireplaceOpeningHeight,
          companyCamUrl: inspection.companyCamUrl,
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
  ].filter(Boolean).join(", ");

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <button
        onClick={() => router.push("/inspections")}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-amber-700 mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Inspections
      </button>

      {/* Header card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-5 mb-4">
        <div className="flex flex-col gap-3">
          <div>
            <div className="text-xs font-mono text-gray-400 mb-1">{inspection.inspectionNumber}</div>
            <h1 className="text-lg md:text-xl font-bold text-gray-900">
              {inspection.customer
                ? `${inspection.customer.firstName} ${inspection.customer.lastName}`
                : propertyLine || "Inspection"}
            </h1>
            {propertyLine && <p className="text-sm text-gray-500 mt-0.5">{propertyLine}</p>}
            <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
              <span>{chimneyTypeLabel(inspection.chimneyType)}</span>
              <span>·</span>
              <span>{inspectionLevelLabel(inspection.inspectionLevel)}</span>
              <span>·</span>
              <span>{formatDate(inspection.inspectionDate)}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>
                  {reviewed}/{allItems.length} reviewed
                  {deficient > 0 && (
                    <span className="text-red-600 font-medium ml-2">{deficient} deficient</span>
                  )}
                </span>
                <span className="font-bold text-amber-700">{progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => save(false)}
              disabled={saving}
              className="flex-1 min-w-0 inline-flex items-center justify-center gap-1.5 text-sm px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600 disabled:opacity-50"
            >
              <Save className="w-4 h-4 shrink-0" />
              {saved ? "Saved!" : saving ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => router.push(`/inspections/${inspection.id}/report`)}
              className="flex-1 min-w-0 inline-flex items-center justify-center gap-1.5 text-sm px-3 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors"
            >
              <FileText className="w-4 h-4 shrink-0" />
              Report
            </button>
          </div>
        </div>
      </div>

      {/* Checklist sections */}
      <div className="space-y-3">
        {inspection.sections.map((section) => {
          const sectionDeficient = section.items.filter((i) => i.result === "deficient").length;
          const sectionAnswered = section.items.filter((i) => i.result && i.result !== "not_applicable").length;
          const isCollapsed = collapsedSections[section.id];

          return (
            <div key={section.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <h2 className="font-semibold text-gray-800 text-sm truncate">{section.sectionTitle}</h2>
                  {sectionDeficient > 0 && (
                    <span className="shrink-0 text-xs px-1.5 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">
                      {sectionDeficient}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-xs text-gray-400">{sectionAnswered}/{section.items.length}</span>
                  {isCollapsed
                    ? <ChevronDown className="w-4 h-4 text-gray-400" />
                    : <ChevronUp className="w-4 h-4 text-gray-400" />
                  }
                </div>
              </button>

              {!isCollapsed && (
                <div className="border-t border-gray-100">
                  {section.items.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`px-4 py-4 ${idx < section.items.length - 1 ? "border-b border-gray-50" : ""} ${
                        item.result === "deficient" ? "bg-red-50/30" : ""
                      }`}
                    >
                      {/* Item label */}
                      <p className="text-sm text-gray-800 leading-relaxed mb-3">{item.label}</p>

                      {/* Result buttons — 2x2 grid on mobile, row on desktop */}
                      <div className="grid grid-cols-2 md:flex md:flex-row gap-2">
                        {RESULT_BUTTONS.map(({ result, label, shortLabel, icon: Icon, activeClass, inactiveClass }) => (
                          <button
                            key={result}
                            onClick={() => setItemResult(section.id, item.id, result)}
                            className={`inline-flex items-center justify-center gap-1.5 text-xs px-2 py-2.5 rounded-lg border transition-colors ${
                              item.result === result ? activeClass : inactiveClass
                            }`}
                          >
                            <Icon className="w-4 h-4 shrink-0" />
                            <span className="md:hidden">{shortLabel}</span>
                            <span className="hidden md:inline">{label}</span>
                          </button>
                        ))}
                      </div>

                      {/* Notes textarea */}
                      {(item.result === "deficient" || item.result === "not_accessible" || item.notes) && (
                        <textarea
                          value={item.notes ?? ""}
                          onChange={(e) => setItemNotes(section.id, item.id, e.target.value)}
                          placeholder={
                            item.result === "deficient"
                              ? "Describe the deficiency and recommended repair…"
                              : "Notes…"
                          }
                          rows={3}
                          className="mt-3 w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                        />
                      )}
                    </div>
                  ))}

                  {/* Section notes */}
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
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

        {/* Sweep-only field notes */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3.5 bg-gray-50 border-b border-gray-100">
            <div>
              <h2 className="font-semibold text-gray-800 text-sm">Field Notes</h2>
              <p className="text-xs text-gray-400 mt-0.5">🔒 Sweep use only — not included in customer report</p>
            </div>
          </div>
          <div className="p-4 space-y-4">
            {/* CompanyCam / photo gallery */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Photo Gallery URL (CompanyCam, Google Photos, etc.)</label>
              <input
                type="url"
                value={inspection.companyCamUrl ?? ""}
                onChange={(e) => setTopLevel("companyCamUrl", e.target.value)}
                placeholder="https://app.companycam.com/projects/..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Measurements */}
            <div>
              <p className="text-xs font-medium text-gray-600 mb-2">Measurements</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Flue Width</label>
                  <input
                    type="text"
                    value={inspection.flueWidth ?? ""}
                    onChange={(e) => setTopLevel("flueWidth", e.target.value)}
                    placeholder={`e.g. 8"`}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Flue Height</label>
                  <input
                    type="text"
                    value={inspection.flueHeight ?? ""}
                    onChange={(e) => setTopLevel("flueHeight", e.target.value)}
                    placeholder={`e.g. 12"`}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Fireplace Opening Width</label>
                  <input
                    type="text"
                    value={inspection.fireplaceOpeningWidth ?? ""}
                    onChange={(e) => setTopLevel("fireplaceOpeningWidth", e.target.value)}
                    placeholder={`e.g. 36"`}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Fireplace Opening Height</label>
                  <input
                    type="text"
                    value={inspection.fireplaceOpeningHeight ?? ""}
                    onChange={(e) => setTopLevel("fireplaceOpeningHeight", e.target.value)}
                    placeholder={`e.g. 28"`}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">Chimney Height</label>
                  <input
                    type="text"
                    value={inspection.chimneyHeight ?? ""}
                    onChange={(e) => setTopLevel("chimneyHeight", e.target.value)}
                    placeholder="e.g. 22 ft"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Roof access */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Roof Access</label>
              <input
                type="text"
                value={inspection.roofAccess ?? ""}
                onChange={(e) => setTopLevel("roofAccess", e.target.value)}
                placeholder="e.g. Steep pitch, need 40ft ladder, accessible from garage roof..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Internal notes */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Internal Notes</label>
              <textarea
                value={inspection.internalNotes ?? ""}
                onChange={(e) => setTopLevel("internalNotes", e.target.value)}
                placeholder="Notes for estimates, future repairs, or follow-up work..."
                rows={4}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Overall condition & summary */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-5 space-y-4">
          <h2 className="font-semibold text-gray-800">Overall Condition & Summary</h2>

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
                <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{cond.description}</div>
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Summary of Findings</label>
            <textarea
              value={inspection.summaryNotes ?? ""}
              onChange={(e) => setTopLevel("summaryNotes", e.target.value)}
              placeholder="Professional narrative summary of inspection findings…"
              rows={4}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Recommendations</label>
            <textarea
              value={inspection.recommendations ?? ""}
              onChange={(e) => setTopLevel("recommendations", e.target.value)}
              placeholder="Recommended corrective actions or follow-up…"
              rows={4}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>

          {/* Bottom actions */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              onClick={() => save(false)}
              disabled={saving}
              className="flex-1 inline-flex items-center justify-center gap-2 text-sm px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saved ? "Saved!" : "Save Draft"}
            </button>
            <button
              onClick={() => save(true)}
              disabled={saving}
              className="flex-1 inline-flex items-center justify-center gap-2 text-sm px-4 py-2.5 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors disabled:opacity-50 font-medium"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark Complete
            </button>
            <button
              onClick={() => router.push(`/inspections/${inspection.id}/report`)}
              className="flex-1 inline-flex items-center justify-center gap-2 text-sm px-4 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              <FileText className="w-4 h-4" />
              View Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
