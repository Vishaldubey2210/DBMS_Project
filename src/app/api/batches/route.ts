// src/app/api/batches/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { z } from "zod";

const batchSchema = z.object({
  itemId:             z.string(),
  batchCode:          z.string().min(1),
  quantity:           z.number().int().positive(),
  remainingQty:       z.number().int().positive(),
  manufactureDate:    z.string().optional(),
  expiryDate:         z.string().optional(),
  maintenanceDueDate: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !["SUPER_ADMIN", "REGIONAL_ADMIN"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body   = await req.json();
  const parsed = batchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { itemId, batchCode, quantity, remainingQty,
          manufactureDate, expiryDate, maintenanceDueDate } = parsed.data;

  const batch = await prisma.batch.create({
    data: {
      itemId,
      batchCode,
      quantity,
      remainingQty,
      manufactureDate:    manufactureDate    ? new Date(manufactureDate)    : null,
      expiryDate:         expiryDate         ? new Date(expiryDate)         : null,
      maintenanceDueDate: maintenanceDueDate ? new Date(maintenanceDueDate) : null,
    },
  });

  return NextResponse.json({ data: batch }, { status: 201 });
}
