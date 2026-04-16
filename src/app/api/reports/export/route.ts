// src/app/api/reports/export/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const stocks = await prisma.stockItem.findMany({
    include: {
      item: { select: { name: true, category: true, minThreshold: true, unit: true } },
      base: { select: { name: true } },
    },
  });

  const rows = [
    ["Item Name", "Category", "Base", "Unit", "Quantity", "Min Threshold", "Status"],
    ...stocks.map((s) => [
      s.item.name,
      s.item.category,
      s.base.name,
      s.item.unit,
      s.quantity,
      s.item.minThreshold,
      s.quantity <= s.item.minThreshold ? "LOW" : "OK",
    ]),
  ];

  const csv = rows.map((r) => r.join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type":        "text/csv",
      "Content-Disposition": `attachment; filename="mims-report.csv"`,
    },
  });
}
