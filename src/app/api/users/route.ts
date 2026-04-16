// src/app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const userSchema = z.object({
  name:         z.string().min(1),
  email:        z.string().email(),
  password:     z.string().min(6),
  role:         z.enum(["SUPER_ADMIN","REGIONAL_ADMIN","BASE_OFFICER","AUDITOR"]),
  commandLevel: z.enum(["CENTRAL_COMMAND","REGIONAL_DEPOT","ARMY_BASE"]),
  unitId:       z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if ((session?.user as any)?.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body   = await req.json();
  const parsed = userSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { name, email, password, role, commandLevel, unitId } = parsed.data;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role, commandLevel, unitId: unitId || null },
  });

  return NextResponse.json({ data: { id: user.id, name: user.name, email: user.email } }, { status: 201 });
}
