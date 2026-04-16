// src/shared/lib/fifo.ts
import { prisma } from "./prisma";

export async function fifoDeduct({
  itemId,
  baseId,
  quantity,
  transferId,
}: {
  itemId:     string;
  baseId:     string;
  quantity:   number;
  transferId?: string;
}) {
  // Get oldest non-exhausted batches
  const batches = await prisma.batch.findMany({
    where: {
      itemId,
      isExhausted: false,
      remainingQty: { gt: 0 },
    },
    orderBy: { receivedAt: "asc" },
  });

  let remaining = quantity;

  await prisma.$transaction(async (tx) => {
    for (const batch of batches) {
      if (remaining <= 0) break;

      const deduct = Math.min(batch.remainingQty, remaining);

      await tx.batch.update({
        where: { id: batch.id },
        data:  {
          remainingQty: { decrement: deduct },
          isExhausted:  batch.remainingQty - deduct === 0,
        },
      });

      await tx.transaction.create({
        data: {
          batchId:    batch.id,
          transferId: transferId ?? null,
          type:       "DEDUCTION",
          quantity:   deduct,
          baseId,
        },
      });

      remaining -= deduct;
    }

    if (remaining > 0) {
      throw new Error(
        `Insufficient batch stock. Shortage: ${remaining} units`
      );
    }

    // Update aggregate stock
    await tx.stockItem.update({
      where: { baseId_itemId: { baseId, itemId } },
      data:  { quantity: { decrement: quantity } },
    });
  });
}
