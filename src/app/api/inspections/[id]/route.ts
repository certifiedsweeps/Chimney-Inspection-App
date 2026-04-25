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

    // Step 1: save top-level inspection fields first (companyCamUrl, notes, etc.)
    await prisma.inspection.update({ where: { id }, data: updateData });

    // Step 2: save checklist items in small parallel batches to avoid
    // overwhelming Neon's HTTP connection limit with 67+ concurrent requests.
    if (sections && Array.isArray(sections)) {
      const allUpdates: Promise<unknown>[] = [];

      for (const s of sections) {
        if (s.id) {
          allUpdates.push(
            prisma.inspectionSection.update({
              where: { id: s.id },
              data: { notes: s.notes ?? null },
            })
          );
        }
        for (const i of (s.items ?? [])) {
          if (i.id) {
            allUpdates.push(
              prisma.inspectionItem.update({
                where: { id: i.id },
                data: { result: i.result ?? null, notes: i.notes ?? null },
              })
            );
          }
        }
      }

      // Run in batches of 10 to stay within Neon HTTP limits
      const BATCH = 10;
      for (let i = 0; i < allUpdates.length; i += BATCH) {
        await Promise.all(allUpdates.slice(i, i + BATCH));
      }
    }

    // Step 3: return the fully updated inspection
    const inspection = await prisma.inspection.findFirst({
      where: { id },
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
