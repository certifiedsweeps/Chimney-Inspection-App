import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import InspectionEditor from "@/components/InspectionEditor";

export const dynamic = "force-dynamic";

export default async function InspectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const inspection = await prisma.inspection.findUnique({
    where: { id },
    include: {
      customer: true,
      sections: {
        orderBy: { sortOrder: "asc" },
        include: { items: { orderBy: { sortOrder: "asc" } } },
      },
    },
  });

  if (!inspection) notFound();

  return <InspectionEditor inspection={JSON.parse(JSON.stringify(inspection))} />;
}
