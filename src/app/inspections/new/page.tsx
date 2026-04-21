import NewInspectionWizard from "@/components/NewInspectionWizard";

export default function NewInspectionPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">New Inspection</h1>
      <p className="text-gray-500 text-sm mb-8">
        Complete all steps to generate a professional NFPA 211–compliant report.
      </p>
      <NewInspectionWizard />
    </div>
  );
}
