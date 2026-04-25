"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { XCircle, CheckCircle2, MinusCircle, FileText, Lock, X } from "lucide-react";

const ONBOARDING_KEY = "onboardingComplete_v1";

const steps = [
  { icon: MinusCircle, color: "text-gray-500", text: "Everything starts as N/A — ignore what doesn't apply" },
  { icon: XCircle,     color: "text-red-600",  text: "Tap Deficient on anything that needs attention, and add a note" },
  { icon: CheckCircle2,color: "text-green-600",text: "Tap Satisfactory on items you checked and found acceptable" },
  { icon: Lock,        color: "text-purple-600",text: "Use Field Notes for your own records — never shown to customers" },
  { icon: FileText,    color: "text-amber-700", text: "Set the overall condition and generate a clean customer report" },
];

export default function OnboardingModal() {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const done = localStorage.getItem(ONBOARDING_KEY);
    if (!done) setVisible(true);
  }, []);

  function dismiss() {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setVisible(false);
  }

  function goToGuide() {
    dismiss();
    router.push("/guide");
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Welcome to Chimney Inspection Pro</h2>
            <p className="text-sm text-gray-500 mt-1">
              Here&apos;s how the app is designed to be used in the field.
            </p>
          </div>
          <button
            onClick={dismiss}
            className="ml-3 shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="px-6 pb-4 space-y-3">
          {steps.map(({ icon: Icon, color, text }, i) => (
            <div key={i} className="flex items-start gap-3">
              <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${color}`} />
              <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-2 flex flex-col sm:flex-row gap-2">
          <button
            onClick={goToGuide}
            className="flex-1 text-sm px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
          >
            View full guide
          </button>
          <button
            onClick={dismiss}
            className="flex-1 text-sm px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg transition-colors font-medium"
          >
            Got it, let&apos;s go
          </button>
        </div>
      </div>
    </div>
  );
}
