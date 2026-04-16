// src/app/(dashboard)/page.tsx
import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { DashboardCharts } from "@/features/analytics/components/DashboardCharts";

async function getStats() {
  const [
    totalStock,
    pendingRequests,
    unreadAlerts,
    activeBases,
    lowStockItems,
  ] = await Promise.all([
    prisma.stockItem.aggregate({ _sum: { quantity: true } }),
    prisma.request.count({ where: { status: "PENDING" } }),
    prisma.alert.count({ where: { isRead: false } }),
    prisma.unit.count({ where: { level: "ARMY_BASE" } }),
    prisma.stockItem.findMany({
      include: { item: true },
    }),
  ]);

  // Calculate low stock properly
  const lowStock = lowStockItems.filter(
    (s) => s.quantity <= s.item.minThreshold
  ).length;

  const recentAlerts = await prisma.alert.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { unit: { select: { name: true } } },
  });

  const recentRequests = await prisma.request.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      fromUnit: { select: { name: true } },
      createdBy: { select: { name: true } },
    },
  });

  return {
    totalStock: totalStock._sum.quantity ?? 0,
    pendingRequests,
    unreadAlerts,
    activeBases,
    lowStock,
    recentAlerts,
    recentRequests,
  };
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-400",
  APPROVED: "bg-green-500/20 text-green-400",
  REJECTED: "bg-red-500/20 text-red-400",
  DISPATCHED: "bg-blue-500/20 text-blue-400",
};

const ALERT_COLORS: Record<string, string> = {
  LOW_STOCK: "text-red-400",
  EXPIRY: "text-orange-400",
  MAINTENANCE_DUE: "text-yellow-400",
};

export default async function DashboardPage() {
  const session = await auth();
  const {
    totalStock,
    pendingRequests,
    unreadAlerts,
    activeBases,
    lowStock,
    recentAlerts,
    recentRequests,
  } = await getStats();

  const STATS = [
    {
      label: "Total Stock Units",
      value: totalStock.toLocaleString(),
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      icon: "📦",
    },
    {
      label: "Pending Requests",
      value: pendingRequests,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      icon: "📋",
    },
    {
      label: "Unread Alerts",
      value: unreadAlerts,
      color: "text-red-400",
      bg: "bg-red-500/10",
      icon: "🔔",
    },
    {
      label: "Low Stock Items",
      value: lowStock,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      icon: "⚠️",
    },
    {
      label: "Active Bases",
      value: activeBases,
      color: "text-green-400",
      bg: "bg-green-500/10",
      icon: "🏕️",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">
          Operations Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Real-time logistics overview — Indian Army MIMS
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {STATS.map(({ label, value, color, bg, icon }) => (
          <div
            key={label}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5"
          >
            <div
              className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center text-xl mb-3`}
            >
              {icon}
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Requests */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">
            Recent Requests
          </h2>
          <div className="space-y-3">
            {recentRequests.length === 0 && (
              <p className="text-sm text-gray-600">No requests yet.</p>
            )}
            {recentRequests.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="text-sm text-white">
                    {r.fromUnit.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {r.createdBy.name}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[r.status]}`}
                >
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">
            Recent Alerts
          </h2>
          <div className="space-y-3">
            {recentAlerts.length === 0 && (
              <p className="text-sm text-gray-600">
                No alerts.
              </p>
            )}
            {recentAlerts.map((a) => (
              <div
                key={a.id}
                className="flex items-start gap-3"
              >
                <span
                  className={`text-sm mt-0.5 ${ALERT_COLORS[a.type]}`}
                >
                  ⚠
                </span>
                <div>
                  <p className="text-sm text-white leading-snug">
                    {a.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {a.unit.name}
                  </p>
                </div>
                {!a.isRead && (
                  <span className="ml-auto w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-1.5" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4">
          Analytics Overview
        </h2>
        <DashboardCharts />
      </div>
    </div>
  );
}
