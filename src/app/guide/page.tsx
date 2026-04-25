import Link from "next/link";
import {
  PlusCircle,
  MinusCircle,
  XCircle,
  CheckCircle2,
  Camera,
  FileText,
  ClipboardList,
  Lock,
  AlertTriangle,
} from "lucide-react";

const steps = [
  {
    icon: PlusCircle,
    color: "text-amber-700 bg-amber-50",
    title: "Start a new inspection",
    body: "Tap New Inspection. Fill in the customer name, property address, chimney type, inspection level, and date. Equipment info and technician details are optional but show on the report.",
  },
  {
    icon: MinusCircle,
    color: "text-gray-600 bg-gray-50",
    title: "Everything starts as N/A — that's intentional",
    body: "Every checklist item defaults to Not Applicable. You don't need to touch items that don't apply to the system in front of you. N/A items are completely invisible on the customer report.",
  },
  {
    icon: XCircle,
    color: "text-red-600 bg-red-50",
    title: "Mark defects as Deficient",
    body: "When you find a problem, tap Deficient and add a note describing exactly what you found and what needs to be done. Be specific — this is what the customer and any contractor will act on.",
  },
  {
    icon: CheckCircle2,
    color: "text-green-700 bg-green-50",
    title: "Mark inspected items as Satisfactory",
    body: "For items you actively checked and found acceptable, tap Satisfactory. This creates a record that you looked — important for liability. You don't have to mark everything, just what you actually assessed.",
  },
  {
    icon: Camera,
    color: "text-blue-600 bg-blue-50",
    title: "Add your CompanyCam link",
    body: "Scroll to the Field Notes section and paste your CompanyCam project URL. The link appears on the customer report as Photo Documentation. Google Photos albums work too.",
  },
  {
    icon: Lock,
    color: "text-purple-600 bg-purple-50",
    title: "Use Field Notes for your records",
    body: "The Field Notes section is sweep-only — it never appears on the customer report. Use it to record flue dimensions, fireplace opening size, roof access difficulty, and anything useful for quoting repairs.",
  },
  {
    icon: FileText,
    color: "text-amber-700 bg-amber-50",
    title: "Set the overall condition and generate the report",
    body: "At the bottom of the checklist, choose Satisfactory, Unsatisfactory, or Further Evaluation. Add a summary and any recommendations. Then tap Report to view the printable PDF-ready report.",
  },
];

const tips = [
  {
    icon: AlertTriangle,
    heading: "Deficient items drive the report",
    text: "The first thing the customer sees after the condition banner is a red Deficiencies Identified box listing every item you marked deficient with your notes. Make those notes clear and actionable.",
  },
  {
    icon: ClipboardList,
    heading: "You don't need to fill everything out",
    text: "A fast field inspection might only have 5–10 items marked. That's fine. The report only shows what matters. The rest stays invisible.",
  },
  {
    icon: Lock,
    heading: "Field Notes never leave the app",
    text: "Roof access difficulty, liner dimensions, estimate notes — anything in Field Notes is yours. Customers never see it, even if they somehow got access to the inspection link.",
  },
];

export default function GuidePage() {
  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">How to Use This App</h1>
        <p className="text-gray-500 text-sm mt-2 leading-relaxed max-w-xl">
          This app is designed for one thing: quickly document what you found, give customers a
          clear written record of defects, and protect yourself with a professional report. You
          don&apos;t need to fill out 57 items on every job.
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-4 mb-10">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={i} className="flex gap-4 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${step.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400">STEP {i + 1}</span>
                </div>
                <p className="font-semibold text-gray-900 text-sm mt-0.5">{step.title}</p>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">{step.body}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips */}
      <h2 className="text-base font-bold text-gray-800 mb-4">Good to know</h2>
      <div className="space-y-3 mb-10">
        {tips.map((tip, i) => {
          const Icon = tip.icon;
          return (
            <div key={i} className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
              <Icon className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-900">{tip.heading}</p>
                <p className="text-sm text-amber-700 mt-0.5 leading-relaxed">{tip.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center">
        <Link
          href="/inspections/new"
          className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Start your first inspection
        </Link>
      </div>
    </div>
  );
}
