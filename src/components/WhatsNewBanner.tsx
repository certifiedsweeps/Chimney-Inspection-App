"use client";
import { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";

// Bump this string whenever you want the banner to reappear for all users.
const BANNER_VERSION = "2026-04-25";

const UPDATES = [
  {
    title: "Checklist defaults to N/A",
    detail:
      "All checklist items now start as Not Applicable. Just mark the items that are relevant — the report only shows what you actively assessed.",
  },
  {
    title: "Field Notes section (sweep only)",
    detail:
      "A new internal section on every inspection lets you record flue dimensions, fireplace opening size, roof access notes, and anything useful for estimates. Never appears on the customer report.",
  },
  {
    title: "CompanyCam / photo gallery link",
    detail:
      "Paste a CompanyCam or Google Photos link on any inspection. It shows as a clickable link on the customer report under Photo Documentation.",
  },
];

export default function WhatsNewBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("whatsNewDismissed");
    if (dismissed !== BANNER_VERSION) setVisible(true);
  }, []);

  function dismiss() {
    localStorage.setItem("whatsNewDismissed", BANNER_VERSION);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm font-semibold text-amber-900">What&apos;s new</p>
        </div>
        <button
          onClick={dismiss}
          className="shrink-0 text-amber-500 hover:text-amber-700 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <ul className="mt-3 space-y-2.5 ml-6">
        {UPDATES.map((u) => (
          <li key={u.title}>
            <p className="text-sm font-medium text-amber-900">{u.title}</p>
            <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">{u.detail}</p>
          </li>
        ))}
      </ul>

      <button
        onClick={dismiss}
        className="mt-3 ml-6 text-xs text-amber-600 hover:text-amber-800 underline transition-colors"
      >
        Got it, dismiss
      </button>
    </div>
  );
}
