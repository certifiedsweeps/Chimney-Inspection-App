import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCompanyId } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const companyId = await requireCompanyId();
    const inspection = await prisma.inspection.findFirst({
      where: { id, companyId },
      include: {
        customer: true,
        sections: {
          orderBy: { sortOrder: "asc" },
          include: { items: { orderBy: { sortOrder: "asc" } } },
        },
      },
    });
    if (!inspection) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(inspection);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch inspection" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const companyId = await requireCompanyId();
    const body = await req.json();
    const { sections, ...topLevel } = body;

    // Verify ownership before updating
    const existing = await prisma.inspection.findFirst({ where: { id, companyId } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updateData: Record<string, unknown> = {};
    const allowed = [
      "status", "inspectionDate", "inspectionLevel", "technicianName",
      "technicianLicense", "propertyAddress", "propertyCity", "propertyState",
      "propertyZip", "applianceMake", "applianceModel", "applianceSerial",
      "fuelType", "applianceType", "flueLinerType", "flueShape", "flueWidth",
      "flueHeight", "chimneyHeight", "fireplaceMake", "fireplaceModel",
      "fireplaceSerial", "overallCondition", "summaryNotes", "recommendations",
      "customerId",
      // Sweep-only field notes
      "internalNotes", "roofAccess", "fireplaceOpeningWidth", "fireplaceOpeningHeight",
      // Photo documentation
      "companyCamUrl",
    ];
    for (const key of allowed) {
      if (key in topLevel) updateData[key] = topLevel[key];
    }

    if (sections && Array.isArray(sections)) {
      // Run all section and item updates in parallel — sequential updates
      // were too slow (67+ round trips) and risked Vercel function timeouts.
      const sectionUpdates = sections
        .filter((s) => s.id)
        .map((s) =>
          prisma.inspectionSection.update({
            where: { id: s.id },
            data: { notes: s.notes ?? null },
          })
        );

      const itemUpdates = sections.flatMap((s) =>
        (s.items ?? [])
          .filter((i: { id?: string }) => i.id)
          .map((i: { id: string; result?: string; notes?: string }) =>
            prisma.inspectionItem.update({
              where: { id: i.id },
              data: {
                result: i.result ?? null,
                notes: i.notes ?? null,
              },
            })
          )
      );

      await Promise.all([...sectionUpdates, ...itemUpdates]);
    }

    const inspection = await prisma.inspection.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        sections: {
          orderBy: { sortOrder: "asc" },
          include: { items: { orderBy: { sortOrder: "asc" } } },
        },
      },
    });

    return NextResponse.json(inspection);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update inspection" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const companyId = await requireCompanyId();
    const existing = await prisma.inspection.findFirst({ where: { id, companyId } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await prisma.inspection.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete inspection" }, { status: 500 });
  }
}
