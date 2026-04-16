// src/app/api/requests/[id]/approve/route.ts
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

  const { id }      = await params;
  const { action, remarks } = await req.json();

  if (!["APPROVED", "REJECTED"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const request = await prisma.request.findUnique({ where: { id } });
  if (!request || request.status !== "PENDING") {
    return NextResponse.json({ error: "Request not in PENDING state" }, { status: 400 });
  }

  const [updated] = await prisma.$transaction([
    prisma.request.update({
      where: { id },
      data:  { status: action },
    }),
    prisma.approvalLog.create({
      data: {
        requestId:  id,
        approvedBy: (session.user as any).userId,
        action,
        remarks,
      },
    }),
  ]);

  return NextResponse.json({ data: updated });
}
