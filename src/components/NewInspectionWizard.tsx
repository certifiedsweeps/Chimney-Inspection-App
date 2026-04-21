"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import { FUEL_TYPES, APPLIANCE_TYPES } from "@/lib/inspectionTemplates";

const STEPS = [
  { id: 1, title: "Customer & Property" },
  { id: 2, title: "Chimney Type & Level" },
  { id: 3, title: "Equipment Info" },
  { id: 4, title: "Technician" },
];

const INSPECTION_LEVELS = [
  {
    value: "level1",
    label: "Level I",
    desc: "Recommended for a chimney that has been regularly serviced and has not undergone any change. Inspection of accessible portions of the chimney from the readily accessible areas.",
  },
  {
    value: "level2",
    label: "Level II",
    desc: "Required upon the sale or transfer of a property, after a chimney fire, or when changes are made to the system. Includes attic, basement, and crawl space inspection and video scanning.",
  },
  {
    value: "level3",
    label: "Level III",
    desc: "When serious hazards are suspected and a Level I or II inspection cannot be completed. May involve removal of certain components.",
  },
];

const CHIMNEY_TYPES = [
  {
    value: "masonry",
    label: "Masonry Chimney",
    desc: "Brick, stone, or block chimney typically with clay tile, metal, or cast-in-place liner serving a fireplace or heating appliance.",
  },
  {
    value: "factory_built",
    label: "Factory-Built Fireplace / Chimney",
    desc: "Listed factory-built (zero-clearance) fireplace with a matching listed metal chimney system in a framed chase.",
  },
];

export default function NewInspectionWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    // Step 1
    customerFirstName: "",
    customerLastName: "",
    customerPhone: "",
    customerEmail: "",
    propertyAddress: "",
    propertyCity: "",
    propertyState: "",
    propertyZip: "",
    sameAsCustomer: true,
    // Step 2
    inspectionLevel: "level2",
    chimneyType: "masonry",
    inspectionDate: new Date().toISOString().split("T")[0],
    // Step 3
    applianceMake: "",
    applianceModel: "",
    applianceSerial: "",
    fuelType: "",
    applianceType: "",
    fireplaceMake: "",
    fireplaceModel: "",
    fireplaceSerial: "",
    flueLinerType: "",
    // Step 4
    technicianName: "",
    technicianLicense: "",
  });

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  async function handleCreate() {
    setSaving(true);
    setError("");
    try {
      // Create customer first if name provided
      let customerId: string | null = null;
      if (form.customerFirstName && form.customerLastName) {
        const custRes = await fetch("/api/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: form.customerFirstName,
            lastName: form.customerLastName,
            phone: form.customerPhone,
            email: form.customerEmail,
          }),
        });
        const cust = await custRes.json();
        customerId = cust.id;
      }

      const res = await fetch("/api/inspections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          inspectionDate: form.inspectionDate,
          inspectionLevel: form.inspectionLevel,
          chimneyType: form.chimneyType,
          technicianName: form.technicianName,
          technicianLicense: form.technicianLicense,
          propertyAddress: form.propertyAddress,
          propertyCity: form.propertyCity,
          propertyState: form.propertyState,
          propertyZip: form.propertyZip,
          applianceMake: form.applianceMake,
          applianceModel: form.applianceModel,
          applianceSerial: form.applianceSerial,
          fuelType: form.fuelType,
          applianceType: form.applianceType,
          fireplaceMake: form.fireplaceMake,
          fireplaceModel: form.fireplaceModel,
          fireplaceSerial: form.fireplaceSerial,
          flueLinerType: form.flueLinerType,
        }),
      });

      if (!res.ok) throw new Error("Failed to create inspection");
      const inspection = await res.json();
      router.push(`/inspections/${inspection.id}`);
    } catch (e) {
      setError("Something went wrong. Please try again.");
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Step indicators */}
      <div className="flex border-b border-gray-100">
        {STEPS.map((s, i) => (
          <div
            key={s.id}
            className={`flex-1 flex items-center gap-2 px-4 py-3 text-sm border-r border-gray-100 last:border-r-0 ${
              s.id === step
                ? "bg-amber-50 text-amber-800 font-medium"
                : s.id < step
                ? "text-green-700"
                : "text-gray-400"
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                s.id < step
                  ? "bg-green-100 text-green-700"
                  : s.id === step
                  ? "bg-amber-700 text-white"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {s.id < step ? <Check className="w-3 h-3" /> : i + 1}
            </span>
            <span className="hidden sm:inline">{s.title}</span>
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="p-6">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-semibold text-gray-800 mb-4">Customer Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <Field label="First Name" value={form.customerFirstName} onChange={(v) => set("customerFirstName", v)} />
                <Field label="Last Name" value={form.customerLastName} onChange={(v) => set("customerLastName", v)} />
                <Field label="Phone" value={form.customerPhone} onChange={(v) => set("customerPhone", v)} type="tel" />
                <Field label="Email" value={form.customerEmail} onChange={(v) => set("customerEmail", v)} type="email" />
              </div>
            </div>
            <div>
              <h2 className="font-semibold text-gray-800 mb-4">Property / Inspection Address</h2>
              <div className="grid grid-cols-1 gap-4">
                <Field label="Street Address" value={form.propertyAddress} onChange={(v) => set("propertyAddress", v)} />
                <div className="grid grid-cols-3 gap-4">
                  <Field label="City" value={form.propertyCity} onChange={(v) => set("propertyCity", v)} />
                  <Field label="State" value={form.propertyState} onChange={(v) => set("propertyState", v)} />
                  <Field label="ZIP Code" value={form.propertyZip} onChange={(v) => set("propertyZip", v)} />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-semibold text-gray-800 mb-1">Chimney / Appliance Type</h2>
              <p className="text-xs text-gray-500 mb-4">Select the type of chimney system being inspected.</p>
              <div className="grid grid-cols-2 gap-3">
                {CHIMNEY_TYPES.map((ct) => (
                  <button
                    key={ct.value}
                    onClick={() => set("chimneyType", ct.value)}
                    className={`text-left p-4 rounded-lg border-2 transition-colors ${
                      form.chimneyType === ct.value
                        ? "border-amber-600 bg-amber-50"
                        : "border-gray-200 hover:border-amber-300"
                    }`}
                  >
                    <div className="font-medium text-sm text-gray-900">{ct.label}</div>
                    <div className="text-xs text-gray-500 mt-1 leading-relaxed">{ct.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-semibold text-gray-800 mb-1">Inspection Level</h2>
              <p className="text-xs text-gray-500 mb-4">Per NFPA 211 §15.3–15.5</p>
              <div className="space-y-3">
                {INSPECTION_LEVELS.map((lvl) => (
                  <button
                    key={lvl.value}
                    onClick={() => set("inspectionLevel", lvl.value)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                      form.inspectionLevel === lvl.value
                        ? "border-amber-600 bg-amber-50"
                        : "border-gray-200 hover:border-amber-300"
                    }`}
                  >
                    <div className="font-medium text-sm text-gray-900">{lvl.label}</div>
                    <div className="text-xs text-gray-500 mt-1 leading-relaxed">{lvl.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-semibold text-gray-800 mb-3">Inspection Date</h2>
              <input
                type="date"
                value={form.inspectionDate}
                onChange={(e) => set("inspectionDate", e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            {form.chimneyType === "masonry" ? (
              <>
                <div>
                  <h2 className="font-semibold text-gray-800 mb-4">Heating Appliance</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <SelectField
                      label="Appliance Type"
                      value={form.applianceType}
                      onChange={(v) => set("applianceType", v)}
                      options={APPLIANCE_TYPES}
                    />
                    <SelectField
                      label="Fuel Type"
                      value={form.fuelType}
                      onChange={(v) => set("fuelType", v)}
                      options={FUEL_TYPES}
                    />
                    <Field label="Make" value={form.applianceMake} onChange={(v) => set("applianceMake", v)} placeholder="e.g. Regency" />
                    <Field label="Model" value={form.applianceModel} onChange={(v) => set("applianceModel", v)} />
                    <Field label="Serial Number" value={form.applianceSerial} onChange={(v) => set("applianceSerial", v)} />
                    <SelectField
                      label="Flue Liner Type"
                      value={form.flueLinerType}
                      onChange={(v) => set("flueLinerType", v)}
                      options={[
                        { value: "clay_tile", label: "Clay Tile (Terracotta)" },
                        { value: "cast_in_place", label: "Cast-In-Place" },
                        { value: "metal_liner", label: "Metal Liner" },
                        { value: "none", label: "No Liner Present" },
                        { value: "unknown", label: "Unable to Determine" },
                      ]}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h2 className="font-semibold text-gray-800 mb-4">Factory-Built Fireplace</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Manufacturer" value={form.fireplaceMake} onChange={(v) => set("fireplaceMake", v)} placeholder="e.g. Heatilator" />
                    <Field label="Model" value={form.fireplaceModel} onChange={(v) => set("fireplaceModel", v)} />
                    <Field label="Serial Number" value={form.fireplaceSerial} onChange={(v) => set("fireplaceSerial", v)} />
                    <SelectField
                      label="Fuel Type"
                      value={form.fuelType}
                      onChange={(v) => set("fuelType", v)}
                      options={FUEL_TYPES}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-semibold text-gray-800 mb-4">Technician Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Technician Name"
                  value={form.technicianName}
                  onChange={(v) => set("technicianName", v)}
                  placeholder="Full name"
                />
                <Field
                  label="CSIA / License Number"
                  value={form.technicianLicense}
                  onChange={(v) => set("technicianLicense", v)}
                  placeholder="e.g. CSIA #12345"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 space-y-2">
              <h3 className="font-medium text-amber-900 text-sm">Inspection Summary</h3>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <dt className="text-gray-500">Customer</dt>
                <dd className="text-gray-800">
                  {form.customerFirstName
                    ? `${form.customerFirstName} ${form.customerLastName}`
                    : "Not provided"}
                </dd>
                <dt className="text-gray-500">Address</dt>
                <dd className="text-gray-800">{form.propertyAddress || "—"}</dd>
                <dt className="text-gray-500">Type</dt>
                <dd className="text-gray-800">
                  {form.chimneyType === "masonry" ? "Masonry Chimney" : "Factory-Built Fireplace"}
                </dd>
                <dt className="text-gray-500">Level</dt>
                <dd className="text-gray-800">
                  {form.inspectionLevel === "level1"
                    ? "Level I"
                    : form.inspectionLevel === "level2"
                    ? "Level II"
                    : "Level III"}
                </dd>
                <dt className="text-gray-500">Date</dt>
                <dd className="text-gray-800">{form.inspectionDate}</dd>
              </dl>
            </div>

            {error && (
              <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-3">
                {error}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100">
        <button
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 1}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        {step < STEPS.length ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleCreate}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors disabled:opacity-60"
          >
            {saving ? "Creating…" : "Create Inspection"} <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Reusable field components ─────────────────────────────────────────────────

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
      >
        <option value="">— Select —</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
