// src/app/(dashboard)/audit/page.tsx
import { prisma } from "@/shared/lib/prisma";

async function getAuditLogs() {
  return await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: { select: { name: true, role: true } } },
  });
}

const ACTION_COLORS: Record<string, string> = {
  CREATE:   "bg-green-500/20 text-green-400",
  UPDATE:   "bg-blue-500/20 text-blue-400",
  DELETE:   "bg-red-500/20 text-red-400",
  TRANSFER: "bg-purple-500/20 text-purple-400",
  APPROVE:  "bg-yellow-500/20 text-yellow-400",
  REJECT:   "bg-red-500/20 text-red-400",
};

export default async function AuditPage() {
  const logs = await getAuditLogs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Audit Trail</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          All system actions — {logs.length} records
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-left">
                <th className="px-4 py-3 text-gray-400 font-medium">Timestamp</th>
                <th className="px-4 py-3 text-gray-400 font-medium">User</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Action</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Table</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Record ID</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Changes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-800/50 transition">
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-white text-xs">{log.user.name}</p>
                    <p className="text-gray-500 text-xs">{log.user.role}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ACTION_COLORS[log.action] ?? "bg-gray-700 text-gray-300"}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-300 text-xs font-mono">
                    {log.tableName}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs font-mono truncate max-w-[100px]">
                    {log.recordId.slice(0, 8)}...
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 max-w-[200px]">
                    {log.newData ? (
                      <span className="text-green-400">
                        {Object.keys(log.newData as object).slice(0, 2).join(", ")}...
                      </span>
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                    No audit logs yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
