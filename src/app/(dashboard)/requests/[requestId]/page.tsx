// src/app/(dashboard)/requests/[requestId]/page.tsx
import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { notFound } from "next/navigation";
import { ApproveRejectButtons } from "@/features/requests/components/ApproveRejectButtons";
import { DispatchButton } from "@/features/requests/components/DispatchButton";

async function getRequest(id: string) {
  return await prisma.request.findUnique({
    where: { id },
    include: {
      fromUnit: true,
      toUnit: true,
      createdBy: { select: { name: true, email: true } },
      items: {
        include: { item: true },
      },
      approvalLogs: {
        include: { approver: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export default async function RequestDetailPage({
  params,
}: {
  params: { requestId: string };
}) {
  const { requestId } = params;
  const session = await auth();
  const role = (session?.user as any)?.role;

  const request = await getRequest(requestId);
  if (!request) notFound();

  const canApprove =
    ["SUPER_ADMIN", "REGIONAL_ADMIN"].includes(role) &&
    request.status === "PENDING";

  const canDispatch =
    ["SUPER_ADMIN", "REGIONAL_ADMIN"].includes(role) &&
    request.status === "APPROVED";

  const STATUS_COLORS: Record<string, string> = {
    PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    APPROVED: "bg-green-500/20 text-green-400 border-green-500/30",
    REJECTED: "bg-red-500/20 text-red-400 border-red-500/30",
    DISPATCHED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <a
          href="/requests"
          className="text-gray-400 hover:text-white text-sm transition"
        >
          ← Back
        </a>
        <h1 className="text-xl font-bold text-white">
          Request Detail
        </h1>

        {request.isEmergency && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
            🚨 Emergency
          </span>
        )}

        <span
          className={`text-xs px-2.5 py-1 rounded-full border font-medium ${STATUS_COLORS[request.status]}`}
        >
          {request.status}
        </span>
      </div>

      {/* Request Info */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 grid grid-cols-2 gap-4">
        {[
          { label: "From", value: request.fromUnit.name },
          { label: "To", value: request.toUnit.name },
          { label: "Created By", value: request.createdBy.name },
          {
            label: "Date",
            value: new Date(request.createdAt).toLocaleString("en-IN"),
          },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-sm text-white mt-0.5">{value}</p>
          </div>
        ))}

        {request.remarks && (
          <div className="col-span-2">
            <p className="text-xs text-gray-500">Remarks</p>
            <p className="text-sm text-white mt-0.5">
              {request.remarks}
            </p>
          </div>
        )}
      </div>

      {/* Requested Items */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800">
          <h2 className="text-sm font-semibold text-white">
            Requested Items
          </h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-left">
              <th className="px-4 py-3 text-gray-400 font-medium">
                Item
              </th>
              <th className="px-4 py-3 text-gray-400 font-medium">
                Category
              </th>
              <th className="px-4 py-3 text-gray-400 font-medium">
                Requested
              </th>
              <th className="px-4 py-3 text-gray-400 font-medium">
                Approved
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {request.items.map((ri) => (
              <tr key={ri.id}>
                <td className="px-4 py-3 text-white">
                  {ri.item.name}
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {ri.item.category}
                </td>
                <td className="px-4 py-3 text-white font-medium">
                  {ri.quantity} {ri.item.unit}
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {ri.approved !== null
                    ? `${ri.approved} ${ri.item.unit}`
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Approve / Reject */}
      {canApprove && (
        <ApproveRejectButtons requestId={request.id} />
      )}

      {/* Dispatch Section */}
      {canDispatch && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-3">
            Dispatch
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            Dispatching will deduct stock from source and credit to
            requesting unit.
          </p>
          <DispatchButton requestId={request.id} />
        </div>
      )}

      {/* Approval History */}
      {request.approvalLogs.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">
            Approval History
          </h2>
          <div className="space-y-3">
            {request.approvalLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start justify-between"
              >
                <div>
                  <p className="text-sm text-white">
                    {log.approver.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(log.createdAt).toLocaleString(
                      "en-IN"
                    )}
                    {log.remarks && ` • "${log.remarks}"`}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    log.action === "APPROVED"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {log.action}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
