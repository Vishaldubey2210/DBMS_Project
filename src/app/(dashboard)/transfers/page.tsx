// src/app/(dashboard)/transfers/page.tsx
import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { NewTransferForm } from "@/features/transfers/components/NewTransferForm";

async function getTransfers() {
  return await prisma.transfer.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      fromUnit:  { select: { name: true } },
      toUnit:    { select: { name: true } },
      initiator: { select: { name: true } },
      transactions: { select: { quantity: true, type: true } },
    },
  });
}

async function getFormData() {
  const [units, items] = await Promise.all([
    prisma.unit.findMany({ where: { level: "ARMY_BASE" } }),
    prisma.item.findMany({ where: { isDeleted: false } }),
  ]);
  return { units, items };
}

export default async function TransfersPage() {
  const session   = await auth();
  const role      = (session?.user as any)?.role;
  const transfers = await getTransfers();
  const { units, items } = await getFormData();
  const canCreate = ["SUPER_ADMIN", "REGIONAL_ADMIN", "BASE_OFFICER"].includes(role);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Transfers</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Base-to-base inventory transfer log
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transfer Form */}
        {canCreate && (
          <div className="lg:col-span-1">
            <NewTransferForm
              units={units}
              items={items}
              currentUnitId={(session?.user as any)?.unitId}
            />
          </div>
        )}

        {/* Transfer Log */}
        <div className={canCreate ? "lg:col-span-2" : "lg:col-span-3"}>
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800">
              <h2 className="text-sm font-semibold text-white">Transfer History</h2>
            </div>
            <div className="divide-y divide-gray-800">
              {transfers.map((t) => (
                <div key={t.id} className="px-5 py-4 hover:bg-gray-800/40 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <p className="text-xs text-gray-400">{t.fromUnit.name}</p>
                      </div>
                      <span className="text-gray-500">→</span>
                      <div className="text-center">
                        <p className="text-xs text-gray-400">{t.toUnit.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{t.quantity} units</p>
                      <p className="text-xs text-gray-500">
                        {new Date(t.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500">By {t.initiator.name}</p>
                    {t.remarks && (
                      <p className="text-xs text-gray-500 italic">"{t.remarks}"</p>
                    )}
                  </div>
                </div>
              ))}
              {transfers.length === 0 && (
                <div className="px-5 py-10 text-center text-gray-500 text-sm">
                  No transfers yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
