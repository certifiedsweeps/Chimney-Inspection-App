import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateInspectionNumber } from "@/lib/utils";
import { getTemplate } from "@/lib/inspectionTemplates";

export async function GET() {
  try {
    const inspections = await prisma.inspection.findMany({
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
    } = body;

    const inspectionNumber = generateInspectionNumber();
    const template = getTemplate(chimneyType);

    const inspection = await prisma.inspection.create({
      data: {
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
        customerId: customerId || null,
        sections: {
          create: template.map((section) => ({
            sectionKey: section.key,
            sectionTitle: section.title,
            sortOrder: section.sortOrder,
            items: {
              create: section.items.map((item) => ({
                itemKey: item.key,
                label: item.label,
                sortOrder: item.sortOrder,
              })),
            },
          })),
        },
      },
      include: {
        sections: { include: { items: true } },
        customer: true,
      },
    });

    return NextResponse.json(inspection, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create inspection" }, { status: 500 });
  }
}
