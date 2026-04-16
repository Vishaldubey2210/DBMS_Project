// src/app/(dashboard)/requests/page.tsx
import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import Link from "next/link";

async function getRequests(role: string, unitId: string) {
  const where =
    role === "SUPER_ADMIN" || role === "REGIONAL_ADMIN"
      ? {}
      : { fromUnitId: unitId };

  return await prisma.request.findMany({
    where,
    include: {
      fromUnit:  { select: { name: true } },
      toUnit:    { select: { name: true } },
      createdBy: { select: { name: true } },
      items: {
        include: { item: { select: { name: true, unit: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

const STATUS_STYLES: Record<string, string> = {
  PENDING:    "bg-yellow-500/20 text-yellow-400",
  APPROVED:   "bg-green-500/20 text-green-400",
  REJECTED:   "bg-red-500/20 text-red-400",
  DISPATCHED: "bg-blue-500/20 text-blue-400",
};

export default async function RequestsPage() {
  const session  = await auth();
  const role     = (session?.user as any)?.role;
  const unitId   = (session?.user as any)?.unitId ?? "";
  const requests = await getRequests(role, unitId);
  const canApprove = ["SUPER_ADMIN", "REGIONAL_ADMIN"].includes(role);
  const canCreate  = ["SUPER_ADMIN", "REGIONAL_ADMIN", "BASE_OFFICER"].includes(role);

  const counts = {
    PENDING:    requests.filter((r) => r.status === "PENDING").length,
    APPROVED:   requests.filter((r) => r.status === "APPROVED").length,
    REJECTED:   requests.filter((r) => r.status === "REJECTED").length,
    DISPATCHED: requests.filter((r) => r.status === "DISPATCHED").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Supply Requests</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Base → Regional → Central request workflow
          </p>
        </div>
        {canCreate && (
          <Link
            href="/requests/new"
            className="bg-green-600 hover:bg-green-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            + New Request
          </Link>
        )}
      </div>

      {/* Status counts */}
      <div className="grid grid-cols-4 gap-3">
        {Object.entries(counts).map(([status, count]) => (
          <div key={status} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${STATUS_STYLES[status].split(" ")[1]}`}>
              {count}
            </p>
            <p className="text-xs text-gray-500 mt-1">{status}</p>
          </div>
        ))}
      </div>

      {/* Requests Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-left">
                <th className="px-4 py-3 text-gray-400 font-medium">From</th>
                <th className="px-4 py-3 text-gray-400 font-medium">To</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Items</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Priority</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Status</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Date</th>
                {canApprove && (
                  <th className="px-4 py-3 text-gray-400 font-medium">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-800/50 transition">
                  <td className="px-4 py-3">
                    <p className="text-white">{req.fromUnit.name}</p>
                    <p className="text-xs text-gray-500">{req.createdBy.name}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{req.toUnit.name}</td>
                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      {req.items.slice(0, 2).map((ri) => (
                        <p key={ri.id} className="text-xs text-gray-300">
                          {ri.item.name} ×{ri.quantity} {ri.item.unit}
                        </p>
                      ))}
                      {req.items.length > 2 && (
                        <p className="text-xs text-gray-500">
                          +{req.items.length - 2} more
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {req.isEmergency ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-medium">
                        🚨 Emergency
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-400">
                        Normal
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[req.status]}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(req.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  {canApprove && (
                    <td className="px-4 py-3">
                      {req.status === "PENDING" && (
                        <Link
                          href={`/requests/${req.id}`}
                          className="text-xs text-green-400 hover:text-green-300 transition"
                        >
                          Review →
                        </Link>
                      )}
                    </td>
                  )}
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-500">
                    No requests found.
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
