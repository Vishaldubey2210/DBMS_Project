// src/app/api/requests/[id]/dispatch/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || !["SUPER_ADMIN", "REGIONAL_ADMIN"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const request = await prisma.request.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!request) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (request.status !== "APPROVED") {
    return NextResponse.json({ error: "Only APPROVED requests can be dispatched" }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    // Mark as dispatched
    await tx.request.update({
      where: { id },
      data:  { status: "DISPATCHED" },
    });

    // Log approval action
    await tx.approvalLog.create({
      data: {
        requestId:  id,
        approvedBy: (session.user as any).userId,
        action:     "DISPATCHED",
        remarks:    "Items dispatched from depot",
      },
    });

    // Deduct stock from destination unit for each item
    for (const ri of request.items) {
      await tx.stockItem.upsert({
        where: {
          baseId_itemId: {
            baseId: request.toUnitId,
            itemId: ri.itemId,
          },
        },
        update: { quantity: { decrement: ri.approved ?? ri.quantity } },
        create: {
          baseId:   request.toUnitId,
          itemId:   ri.itemId,
          quantity: 0,
        },
      });

      // Add to requesting unit
      await tx.stockItem.upsert({
        where: {
          baseId_itemId: {
            baseId: request.fromUnitId,
            itemId: ri.itemId,
          },
        },
        update: { quantity: { increment: ri.approved ?? ri.quantity } },
        create: {
          baseId:   request.fromUnitId,
          itemId:   ri.itemId,
          quantity: ri.approved ?? ri.quantity,
        },
      });

      // Log transaction
      await tx.transaction.create({
        data: {
          type:      "DEDUCTION",
          quantity:  ri.approved ?? ri.quantity,
          baseId:    request.toUnitId,
          createdAt: new Date(),
        },
      });
    }
  });

  return NextResponse.json({ message: "Request dispatched successfully" });
}
