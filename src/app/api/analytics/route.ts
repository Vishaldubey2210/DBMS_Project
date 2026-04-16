// src/app/api/analytics/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [
      totalStock,
      lowStockRaw,
      pendingRequests,
      mostRequestedRaw,
      baseWiseStockRaw,
      recentTransactions,
    ] = await Promise.all([
      // Total stock units
      prisma.stockItem.aggregate({ _sum: { quantity: true } }),

      // Low stock items
      prisma.stockItem.findMany({
        where: {
          item: { isDeleted: false },
        },
        include: {
          item: { select: { name: true, minThreshold: true } },
          base: { select: { name: true } },
        },
      }),

      // Pending requests count
      prisma.request.count({ where: { status: "PENDING" } }),

      // Most requested items
      prisma.requestItem.groupBy({
        by: ["itemId"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),

      // Base-wise stock
      prisma.stockItem.groupBy({
        by: ["baseId"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
      }),

      // Recent transactions (last 6 months grouped by month)
      prisma.transaction.findMany({
        where: {
          type:      "DEDUCTION",
          createdAt: {
            gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000),
          },
        },
        orderBy: { createdAt: "asc" },
        select:  { quantity: true, createdAt: true },
      }),
    ]);

    // Low stock filter
    const lowStockItems = lowStockRaw
      .filter((s) => s.quantity <= s.item.minThreshold)
      .slice(0, 10)
      .map((s) => ({
        name:         s.item.name,
        quantity:     s.quantity,
        minThreshold: s.item.minThreshold,
        baseName:     s.base.name,
      }));

    // Most requested — enrich with item names
    const itemIds = mostRequestedRaw.map((r) => r.itemId);
    const itemNames = await prisma.item.findMany({
      where:  { id: { in: itemIds } },
      select: { id: true, name: true },
    });
    const itemNameMap = Object.fromEntries(itemNames.map((i) => [i.id, i.name]));
    const mostRequested = mostRequestedRaw.map((r) => ({
      name:           itemNameMap[r.itemId] ?? "Unknown",
      totalRequested: r._sum.quantity ?? 0,
    }));

    // Base-wise stock — enrich with base names
    const baseIds = baseWiseStockRaw.map((b) => b.baseId);
    const bases   = await prisma.unit.findMany({
      where:  { id: { in: baseIds } },
      select: { id: true, name: true },
    });
    const baseNameMap  = Object.fromEntries(bases.map((b) => [b.id, b.name]));
    const baseWiseStock = baseWiseStockRaw.map((b) => ({
      baseName: baseNameMap[b.baseId] ?? "Unknown",
      totalQty: b._sum.quantity ?? 0,
    }));

    // Monthly dispatch — group by month in JS
    const monthlyMap: Record<string, number> = {};
    for (const t of recentTransactions) {
      const month = t.createdAt.toISOString().slice(0, 7); // "2026-02"
      monthlyMap[month] = (monthlyMap[month] ?? 0) + t.quantity;
    }
    const monthlyDispatches = Object.entries(monthlyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, total]) => ({ month, total }));

    // Predictive — avg monthly usage per item via transactions
    const sixMonthTransactions = await prisma.transaction.findMany({
      where: {
        type:      "DEDUCTION",
        createdAt: { gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) },
      },
      select: { quantity: true, baseId: true, createdAt: true },
    });

    // Simple avg: total / 6 months
    const totalUsagePerBase: Record<string, number> = {};
    for (const t of sixMonthTransactions) {
      totalUsagePerBase[t.baseId] = (totalUsagePerBase[t.baseId] ?? 0) + t.quantity;
    }

    const predictive = Object.entries(totalUsagePerBase)
      .map(([baseId, total]) => ({
        item_name:       baseNameMap[baseId] ?? baseId,
        avg_monthly:     Math.round(total / 6),
        suggested_stock: Math.round((total / 6) * 2),
      }))
      .sort((a, b) => b.avg_monthly - a.avg_monthly)
      .slice(0, 6);

    return NextResponse.json({
      totalStock:        totalStock._sum.quantity ?? 0,
      lowStockItems,
      pendingRequests,
      monthlyDispatches,
      mostRequested,
      baseWiseStock,
      predictive,
    });
  } catch (err) {
    console.error("[analytics]", err);
    return NextResponse.json({ error: "Analytics query failed" }, { status: 500 });
  }
}
