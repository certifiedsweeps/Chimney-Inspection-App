import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import InspectionReport from "@/components/InspectionReport";

export const dynamic = "force-dynamic";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [inspection, company] = await Promise.all([
    prisma.inspection.findUnique({
      where: { id },
      include: {
        customer: true,
        sections: {
          orderBy: { sortOrder: "asc" },
          include: { items: { orderBy: { sortOrder: "asc" } } },
        },
      },
    }),
    prisma.company.findFirst(),
  ]);

  if (!inspection) notFound();

  console.log("report companyCamUrl:", inspection.companyCamUrl);

  return (
    <InspectionReport
      inspection={JSON.parse(JSON.stringify(inspection))}
      company={company ? JSON.parse(JSON.stringify(company)) : null}
    />
  );
}
