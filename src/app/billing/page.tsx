import { prisma } from "@/lib/prisma";
import { requireCompanyId } from "@/lib/auth";
import { CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 49,
    period: "month",
    description: "Perfect for a single technician",
    features: [
      "Up to 50 inspections/month",
      "1 technician account",
      "PDF report generation",
      "Customer management",
      "Email support",
    ],
    cta: "Start Free Trial",
    highlight: false,
  },
  {
    id: "pro",
    name: "Professional",
    price: 99,
    period: "month",
    description: "For growing inspection businesses",
    features: [
      "Unlimited inspections",
      "Up to 5 technician accounts",
      "PDF report generation",
      "Customer management",
      "AI report summaries (Claude)",
      "Priority email support",
    ],
    cta: "Start Free Trial",
    highlight: true,
  },
  {
    id: "business",
    name: "Business",
    price: 199,
    period: "month",
    description: "Multi-location or franchise operations",
    features: [
      "Unlimited inspections",
      "Unlimited technician accounts",
      "Everything in Professional",
      "Custom report branding",
      "Phone support",
      "Onboarding call",
    ],
    cta: "Contact Us",
    highlight: false,
  },
];

export default async function BillingPage() {
  const companyId = await requireCompanyId();
  const company = await prisma.company.findUnique({ where: { companyId } });
  const currentPlan = company?.stripePlanId ?? null;
  const subStatus = company?.subscriptionStatus ?? null;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Billing & Plans</h1>
        <p className="text-gray-500 text-sm mt-1">
          Choose the plan that fits your business. All plans include a 14-day free trial.
        </p>
        {subStatus && (
          <div className="mt-3 inline-flex items-center gap-2 text-sm px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg">
            <CheckCircle2 className="w-4 h-4" />
            Current plan: <strong>{currentPlan}</strong> — {subStatus}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col ${
              plan.highlight ? "border-amber-500 ring-2 ring-amber-500/20" : "border-gray-100"
            }`}
          >
            {plan.highlight && (
              <div className="bg-amber-700 text-white text-xs font-semibold text-center py-1.5 tracking-wide uppercase">
                Most Popular
              </div>
            )}
            <div className="p-6 flex-1">
              <h2 className="font-bold text-lg text-gray-900">{plan.name}</h2>
              <p className="text-gray-500 text-sm mt-1">{plan.description}</p>
              <div className="mt-4 flex items-end gap-1">
                <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                <span className="text-gray-400 text-sm mb-1">/{plan.period}</span>
              </div>
              <ul className="mt-5 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-6 pb-6">
              <button
                disabled
                className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  plan.highlight
                    ? "bg-amber-700 text-white hover:bg-amber-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {plan.cta} — Coming Soon
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400 mt-8">
        Stripe billing integration coming soon. Contact us to get set up early.
      </p>
    </div>
  );
}
