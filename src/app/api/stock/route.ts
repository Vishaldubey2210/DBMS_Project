// src/app/api/stock/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !["SUPER_ADMIN", "REGIONAL_ADMIN"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { itemId, baseId, quantity } = await req.json();

  const stock = await prisma.stockItem.upsert({
    where:  { baseId_itemId: { baseId, itemId } },
    update: { quantity: { increment: quantity } },
    create: { itemId, baseId, quantity },
  });

  return NextResponse.json({ data: stock }, { status: 201 });
}
