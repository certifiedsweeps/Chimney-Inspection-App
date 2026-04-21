"use client";
import { useState } from "react";
import { Save, CheckCircle } from "lucide-react";

type Company = {
  id?: string;
  name?: string;
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

export default function CompanySettingsForm({ company }: { company: Company | null }) {
  const [form, setForm] = useState({
    name: company?.name ?? "",
    address: company?.address ?? "",
    city: company?.city ?? "",
    state: company?.state ?? "",
    zip: company?.zip ?? "",
    phone: company?.phone ?? "",
    email: company?.email ?? "",
    website: company?.website ?? "",
    licenseNum: company?.licenseNum ?? "",
    csiaNum: company?.csiaNum ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (k: keyof typeof form, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
      <div>
        <h2 className="font-semibold text-gray-800 mb-4">Company Information</h2>
        <div className="space-y-4">
          <Field label="Company Name" value={form.name} onChange={(v) => set("name", v)} required />
          <Field label="Street Address" value={form.address} onChange={(v) => set("address", v)} />
          <div className="grid grid-cols-3 gap-4">
            <Field label="City" value={form.city} onChange={(v) => set("city", v)} />
            <Field label="State" value={form.state} onChange={(v) => set("state", v)} />
            <Field label="ZIP" value={form.zip} onChange={(v) => set("zip", v)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Phone" value={form.phone} onChange={(v) => set("phone", v)} type="tel" />
            <Field label="Email" value={form.email} onChange={(v) => set("email", v)} type="email" />
          </div>
          <Field label="Website" value={form.website} onChange={(v) => set("website", v)} />
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-gray-800 mb-4">License &amp; Certifications</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="State License Number"
            value={form.licenseNum}
            onChange={(v) => set("licenseNum", v)}
            placeholder="e.g. #HIC-123456"
          />
          <Field
            label="CSIA Certification Number"
            value={form.csiaNum}
            onChange={(v) => set("csiaNum", v)}
            placeholder="e.g. CSIA #98765"
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          These numbers appear in the technician credentials section of all reports.
        </p>
      </div>

      <div className="pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors disabled:opacity-60"
        >
          {saved ? (
            <>
              <CheckCircle className="w-4 h-4" /> Saved!
            </>
          ) : saving ? (
            "Saving…"
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
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
