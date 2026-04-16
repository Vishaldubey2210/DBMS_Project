// src/app/api/alerts/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id }    = await params;
  const { isRead } = await req.json();

  const alert = await prisma.alert.update({
    where: { id },
    data: { isRead },
  });

  return NextResponse.json({ data: alert });
}
