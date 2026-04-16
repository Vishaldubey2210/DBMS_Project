// src/app/(dashboard)/alerts/page.tsx
import { prisma } from "@/shared/lib/prisma";
import { MarkAlertRead } from "@/features/alerts/components/MarkAlertRead";

async function getAlerts() {
  return await prisma.alert.findMany({
    orderBy: { createdAt: "desc" },
    include: { unit: { select: { name: true } } },
  });
}

const ALERT_CONFIG: Record<string, { icon: string; color: string; bg: string }> = {
  LOW_STOCK:       { icon: "📦", color: "text-red-400",    bg: "bg-red-500/10 border-red-500/20" },
  EXPIRY:          { icon: "⏰", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
  MAINTENANCE_DUE: { icon: "🔧", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
};

export default async function AlertsPage() {
  const alerts  = await getAlerts();
  const unread  = alerts.filter((a) => !a.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Alerts</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {unread} unread alert{unread !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Alert type summary */}
      <div className="grid grid-cols-3 gap-4">
        {(["LOW_STOCK", "EXPIRY", "MAINTENANCE_DUE"] as const).map((type) => {
          const cfg   = ALERT_CONFIG[type];
          const count = alerts.filter((a) => a.type === type).length;
          return (
            <div key={type} className={`border rounded-xl p-4 ${cfg.bg}`}>
              <p className="text-2xl mb-1">{cfg.icon}</p>
              <p className={`text-xl font-bold ${cfg.color}`}>{count}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {type.replace("_", " ")}
              </p>
            </div>
          );
        })}
      </div>

      {/* Alerts list */}
      <div className="space-y-3">
        {alerts.map((alert) => {
          const cfg = ALERT_CONFIG[alert.type];
          return (
            <div
              key={alert.id}
              className={`border rounded-xl p-4 flex items-start justify-between gap-4 transition
                ${alert.isRead ? "bg-gray-900 border-gray-800 opacity-60" : `${cfg.bg}`}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">{cfg.icon}</span>
                <div>
                  <p className={`text-sm font-medium ${cfg.color}`}>
                    {alert.type.replace(/_/g, " ")}
                  </p>
                  <p className="text-sm text-gray-300 mt-0.5">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {alert.unit.name} •{" "}
                    {new Date(alert.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {!alert.isRead && (
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                )}
                <MarkAlertRead alertId={alert.id} isRead={alert.isRead} />
              </div>
            </div>
          );
        })}
        {alerts.length === 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center text-gray-500">
            No alerts at this time.
          </div>
        )}
      </div>
    </div>
  );
}
