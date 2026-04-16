// src/app/api/inventory/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { z } from "zod";

const itemSchema = z.object({
  name:          z.string().min(1),
  code:          z.string().min(1),
  category:      z.enum(["WEAPONS", "FOOD", "MEDICAL"]),
  unit:          z.string().min(1),
  minThreshold:  z.number().int().positive(),
  specifications: z.record(z.any()).optional(),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const category = searchParams.get("category");
  const baseId   = searchParams.get("baseId");

  const items = await prisma.stockItem.findMany({
    where: {
      ...(baseId && { baseId }),
      item: {
        isDeleted: false,
        ...(category && { category: category as any }),
      },
    },
    include: {
      item: true,
      base: { select: { name: true, level: true } },
    },
    orderBy: { lastUpdated: "desc" },
  });

  return NextResponse.json({ data: items });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !["SUPER_ADMIN", "REGIONAL_ADMIN"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body   = await req.json();
  const parsed = itemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const item = await prisma.item.create({ data: parsed.data });
  return NextResponse.json({ data: item }, { status: 201 });
}
