import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCompanyId } from "@/lib/auth";

export async function GET() {
  try {
    const companyId = await requireCompanyId();
    const customers = await prisma.customer.findMany({
      where: { companyId },
      orderBy: { lastName: "asc" },
      include: { _count: { select: { inspections: true } } },
    });
    return NextResponse.json(customers);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const companyId = await requireCompanyId();
    const body = await req.json();
    const customer = await prisma.customer.create({
      data: { ...body, companyId },
    });
    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
  }
}
