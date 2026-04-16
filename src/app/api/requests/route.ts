// src/app/api/requests/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { z } from "zod";

const requestSchema = z.object({
  toUnitId:    z.string(),
  isEmergency: z.boolean().default(false),
  remarks:     z.string().optional(),
  items: z.array(z.object({
    itemId:   z.string(),
    quantity: z.number().int().positive(),
  })),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user   = session.user as any;
  const body   = await req.json();
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { toUnitId, isEmergency, remarks, items } = parsed.data;

  const request = await prisma.request.create({
    data: {
      fromUnitId:  user.unitId,
      toUnitId,
      createdById: user.userId,
      isEmergency,
      remarks,
      // Auto-approve emergency requests
      status: isEmergency ? "APPROVED" : "PENDING",
      items: {
        create: items.map((i) => ({
          itemId:   i.itemId,
          quantity: i.quantity,
        })),
      },
    },
    include: { items: true },
  });

  return NextResponse.json({ data: request }, { status: 201 });
}
