// src/features/analytics/components/DashboardCharts.tsx
"use client";
import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

type AnalyticsData = {
  totalStock:        number;
  pendingRequests:   number;
  lowStockItems:     { name: string; quantity: number; baseName: string }[];
  monthlyDispatches: { month: string; total: number }[];
  mostRequested:     { name: string; totalRequested: number }[];
  baseWiseStock:     { baseName: string; totalQty: number }[];
  predictive:        { item_name: string; avg_monthly: number; suggested_stock: number }[];
};

export function DashboardCharts() {
  const [data,    setData]    = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    fetch("/api/analytics")
      .then(async (r) => {
        // ← GUARD: empty response check
        const text = await r.text();
        if (!text) throw new Error("Empty response from analytics API");
        return JSON.parse(text);
      })
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-gray-900 border border-gray-800 rounded-xl h-64 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-red-400 text-sm">
        ⚠ Analytics error: {error}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Monthly Dispatch Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">
            Monthly Dispatch Trend
          </h3>
          {data.monthlyDispatches.length === 0 ? (
            <div className="flex items-center justify-center h-44 text-gray-500 text-sm">
              No dispatch data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={data.monthlyDispatches}>
                <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: 8,
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Bar dataKey="total" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Base-wise Stock Pie */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">
            Base-wise Stock Distribution
          </h3>
          {data.baseWiseStock.length === 0 ? (
            <div className="flex items-center justify-center h-44 text-gray-500 text-sm">
              No stock data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={data.baseWiseStock}
                  dataKey="totalQty"
                  nameKey="baseName"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {data.baseWiseStock.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: 8,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Most Requested Items */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">
            Most Requested Items
          </h3>
          {data.mostRequested.length === 0 ? (
            <div className="flex items-center justify-center h-44 text-gray-500 text-sm">
              No request data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={data.mostRequested} layout="vertical">
                <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 11 }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    background: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="totalRequested" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Predictive Consumption */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">
            Predictive Stock Requirement
            <span className="ml-2 text-xs text-gray-500 font-normal">
              (next 2 months)
            </span>
          </h3>
          {data.predictive.length === 0 ? (
            <div className="flex items-center justify-center h-44 text-gray-500 text-sm">
              Insufficient transaction history
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-44 pr-1">
              {data.predictive.map((p) => {
                const maxAvg = Math.max(
                  ...data.predictive.map((x) => x.avg_monthly),
                  1
                );
                return (
                  <div key={p.item_name} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{p.item_name}</p>
                      <div className="mt-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full transition-all"
                          style={{
                            width: `${Math.min(
                              (p.avg_monthly / maxAvg) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-gray-400">
                        Avg: {p.avg_monthly}/mo
                      </p>
                      <p className="text-xs text-green-400 font-medium">
                        Need: {p.suggested_stock}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Low Stock Warning */}
      {data.lowStockItems.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-red-400 mb-3">
            ⚠ Low Stock Items ({data.lowStockItems.length})
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {data.lowStockItems.map((item) => (
              <div
                key={item.name}
                className="bg-gray-900 rounded-lg p-3 border border-red-500/20"
              >
                <p className="text-xs text-white font-medium truncate">
                  {item.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{item.baseName}</p>
                <p className="text-lg font-bold text-red-400 mt-1">
                  {item.quantity}
                  <span className="text-xs text-gray-500 ml-1 font-normal">
                    / {item.minThreshold} min
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
