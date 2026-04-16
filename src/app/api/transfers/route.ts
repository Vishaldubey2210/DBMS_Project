// src/app/api/transfers/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { z } from "zod";
import { fifoDeduct } from "@/shared/lib/fifo";

const transferSchema = z.object({
  toUnitId: z.string().min(1),
  itemId: z.string().min(1),
  quantity: z.number().int().positive(),
  remarks: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = session.user as any;

    if (!user.unitId) {
      return NextResponse.json(
        { error: "Invalid user unit context" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const parsed = transferSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const { toUnitId, itemId, quantity, remarks } = parsed.data;

    // Check source stock
    const sourceStock = await prisma.stockItem.findUnique({
      where: {
        baseId_itemId: {
          baseId: user.unitId,
          itemId,
        },
      },
    });

    if (!sourceStock || sourceStock.quantity < quantity) {
      return NextResponse.json(
        { error: "Insufficient stock at source base" },
        { status: 400 }
      );
    }

    // Atomic Transfer
    const transfer = await prisma.$transaction(async (tx) => {
      // 1️⃣ Create transfer record first
      const transferRecord = await tx.transfer.create({
        data: {
          fromUnitId: user.unitId,
          toUnitId,
          initiatedBy: user.userId,
          itemId,
          quantity,
          remarks,
        },
      });

      // 2️⃣ FIFO deduction (batch-aware deduction)
      await fifoDeduct({
        tx,
        itemId,
        baseId: user.unitId,
        quantity,
        transferId: transferRecord.id,
      });

      // 3️⃣ Add to destination stock
      await tx.stockItem.upsert({
        where: {
          baseId_itemId: {
            baseId: toUnitId,
            itemId,
          },
        },
        update: {
          quantity: { increment: quantity },
        },
        create: {
          baseId: toUnitId,
          itemId,
          quantity,
        },
      });

      // 4️⃣ Log transaction (destination entry)
      await tx.transaction.create({
        data: {
          transferId: transferRecord.id,
          type: "TRANSFER",
          quantity,
          baseId: user.unitId,
        },
      });

      return transferRecord;
    });

    return NextResponse.json(
      { data: transfer },
      { status: 201 }
    );
  } catch (error) {
    console.error("Transfer API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
