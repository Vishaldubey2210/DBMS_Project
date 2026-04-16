// src/app/(dashboard)/login-history/page.tsx
import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { redirect } from "next/navigation";

async function getLoginHistory() {
  return await prisma.loginHistory.findMany({
    orderBy: { createdAt: "desc" },
    take:    200,
    include: {
      user: { select: { name: true, email: true, role: true } },
    },
  });
}

export default async function LoginHistoryPage() {
  const session = await auth();
  if (!["SUPER_ADMIN", "AUDITOR"].includes((session?.user as any)?.role)) {
    redirect("/");
  }

  const history = await getLoginHistory();
  const failed  = history.filter((h) => !h.success).length;
  const success = history.filter((h) => h.success).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Login History</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Authentication attempt log
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Attempts", value: history.length,  color: "text-white"       },
          { label: "Successful",     value: success,          color: "text-green-400"   },
          { label: "Failed",         value: failed,           color: "text-red-400"     },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-left">
                <th className="px-4 py-3 text-gray-400 font-medium">User</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Role</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Status</th>
                <th className="px-4 py-3 text-gray-400 font-medium">IP Address</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {history.map((h) => (
                <tr
                  key={h.id}
                  className={`transition ${
                    !h.success ? "bg-red-500/5 hover:bg-red-500/10" : "hover:bg-gray-800/50"
                  }`}
                >
                  <td className="px-4 py-3">
                    <p className="text-white">{h.user.name}</p>
                    <p className="text-xs text-gray-500">{h.user.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {h.user.role.replace(/_/g, " ")}
                  </td>
                  <td className="px-4 py-3">
                    {h.success ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                        ✓ Success
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
                        ✕ Failed
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs font-mono">
                    {h.ipAddress ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(h.createdAt).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                    No login history yet.
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
