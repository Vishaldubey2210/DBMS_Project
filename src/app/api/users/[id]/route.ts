// src/app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if ((session?.user as any)?.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { isActive } = await req.json();

  const user = await prisma.user.update({
    where: { id },
    data:  { isActive, lockedUntil: isActive ? null : undefined },
  });

  return NextResponse.json({ data: { id: user.id, isActive: user.isActive } });
}
