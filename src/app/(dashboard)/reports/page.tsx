// src/app/(dashboard)/reports/page.tsx
import { prisma } from "@/shared/lib/prisma";
import { ExportCSVButton } from "@/features/reports/components/ExportCSVButton";

async function getReportData() {
  const [stockSummary, requestSummary] = await Promise.all([
    prisma.stockItem.findMany({
      include: {
        item: { select: { name: true, category: true, minThreshold: true } },
        base: { select: { name: true } },
      },
    }),
    prisma.request.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
  ]);
  return { stockSummary, requestSummary };
}

export default async function ReportsPage() {
  const { stockSummary, requestSummary } = await getReportData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Reports</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Export and analyze logistics data
          </p>
        </div>
        <ExportCSVButton />
      </div>

      {/* Request Status Summary */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4">
          Request Status Summary
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {requestSummary.map((r) => (
            <div key={r.status} className="text-center">
              <p className="text-2xl font-bold text-white">{r._count.id}</p>
              <p className="text-xs text-gray-500 mt-1">{r.status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stock Summary Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800">
          <h2 className="text-sm font-semibold text-white">
            Stock Summary — All Bases
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-left">
                <th className="px-4 py-3 text-gray-400 font-medium">Item</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Category</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Base</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Qty</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Min Threshold</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {stockSummary.map((s) => {
                const isLow = s.quantity <= s.item.minThreshold;
                return (
                  <tr key={s.id} className="hover:bg-gray-800/50">
                    <td className="px-4 py-3 text-white">{s.item.name}</td>
                    <td className="px-4 py-3 text-gray-400">{s.item.category}</td>
                    <td className="px-4 py-3 text-gray-300">{s.base.name}</td>
                    <td className="px-4 py-3 text-white font-medium">{s.quantity}</td>
                    <td className="px-4 py-3 text-gray-400">{s.item.minThreshold}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${isLow ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>
                        {isLow ? "Low" : "OK"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
