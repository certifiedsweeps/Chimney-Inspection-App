import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateInspectionNumber } from "@/lib/utils";
import { getTemplate } from "@/lib/inspectionTemplates";
import { requireCompanyId } from "@/lib/auth";

export async function GET() {
  try {
    const companyId = await requireCompanyId();
    const inspections = await prisma.inspection.findMany({
      where: { companyId },
      include: { customer: true },
      orderBy: { inspectionDate: "desc" },
    });
    return NextResponse.json(inspections);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch inspections" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const companyId = await requireCompanyId();
    const body = await req.json();
    const {
      customerId,
      inspectionDate,
      inspectionLevel,
      chimneyType,
      technicianName,
      technicianLicense,
      propertyAddress,
      propertyCity,
      propertyState,
      propertyZip,
      applianceMake,
      applianceModel,
      applianceSerial,
      fuelType,
      applianceType,
      fireplaceMake,
      fireplaceModel,
      fireplaceSerial,
      flueLinerType,
    } = body;

    const inspectionNumber = generateInspectionNumber();
    const template = getTemplate(chimneyType);

    // Step 1: create the inspection row (no nested writes — Neon HTTP doesn't support transactions)
    const inspection = await prisma.inspection.create({
      data: {
        companyId,
        inspectionNumber,
        inspectionDate: inspectionDate ? new Date(inspectionDate) : new Date(),
        inspectionLevel,
        chimneyType,
        technicianName,
        technicianLicense,
        propertyAddress,
        propertyCity,
        propertyState,
        propertyZip,
        applianceMake,
        applianceModel,
        applianceSerial,
        fuelType,
        applianceType,
        fireplaceMake,
        fireplaceModel,
        fireplaceSerial,
        flueLinerType,
        customerId: customerId || null,
      },
    });

    // Step 2: create sections and their items sequentially
    for (const section of template) {
      const sec = await prisma.inspectionSection.create({
        data: {
          inspectionId: inspection.id,
          sectionKey: section.key,
          sectionTitle: section.title,
          sortOrder: section.sortOrder,
        },
      });
      if (section.items.length > 0) {
        await prisma.inspectionItem.createMany({
          data: section.items.map((item) => ({
            sectionId: sec.id,
            itemKey: item.key,
            label: item.label,
            sortOrder: item.sortOrder,
          })),
        });
      }
    }

    // Step 3: return the full inspection with all relations
    const full = await prisma.inspection.findUnique({
      where: { id: inspection.id },
      include: { sections: { include: { items: true } }, customer: true },
    });

    return NextResponse.json(full, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("POST /api/inspections error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
