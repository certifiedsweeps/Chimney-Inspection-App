import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const company = await prisma.company.findFirst();
    return NextResponse.json(company ?? {});
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch company" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const existing = await prisma.company.findFirst();
    let company;
    if (existing) {
      company = await prisma.company.update({ where: { id: existing.id }, data: body });
    } else {
      company = await prisma.company.create({ data: body });
    }
    return NextResponse.json(company);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save company" }, { status: 500 });
  }
}
