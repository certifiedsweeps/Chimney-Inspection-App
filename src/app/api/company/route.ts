import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCompanyId } from "@/lib/auth";

export async function GET() {
  try {
    const companyId = await requireCompanyId();
    const company = await prisma.company.findUnique({ where: { companyId } });
    return NextResponse.json(company ?? {});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch company" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const companyId = await requireCompanyId();
    const body = await req.json();
    const company = await prisma.company.upsert({
      where: { companyId },
      update: body,
      create: { ...body, companyId },
    });
    return NextResponse.json(company);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save company" }, { status: 500 });
  }
}
