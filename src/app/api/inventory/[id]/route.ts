// src/app/api/inventory/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || !["SUPER_ADMIN", "REGIONAL_ADMIN"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id }       = await params;
  const { quantity } = await req.json();

  if (typeof quantity !== "number" || quantity < 0) {
    return NextResponse.json({ error: "Invalid quantity" }, { status: 422 });
  }

  const stock = await prisma.stockItem.update({
    where: { id },
    data:  { quantity },
  });

  return NextResponse.json({ data: stock });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if ((session?.user as any)?.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  // Soft delete
  const stock = await prisma.stockItem.findUnique({ where: { id } });
  if (!stock) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.item.update({
    where: { id: stock.itemId },
    data:  { isDeleted: true, deletedAt: new Date() },
  });

  return NextResponse.json({ message: "Item soft deleted" });
}
