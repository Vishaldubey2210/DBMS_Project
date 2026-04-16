// src/app/(dashboard)/inventory/[itemId]/page.tsx
import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { notFound } from "next/navigation";
import { EditStockForm } from "@/features/inventory/components/EditStockForm";
import { BatchPanel } from "@/features/inventory/components/BatchPanel";

async function getStockItem(id: string) {
  return await prisma.stockItem.findUnique({
    where: { id },
    include: {
      item: true,
      base: true,
    },
  });
}

async function getBatches(itemId: string) {
  return await prisma.batch.findMany({
    where:   { itemId, isExhausted: false },
    orderBy: { receivedAt: "asc" },
  });
}

export default async function InventoryDetailPage({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const { itemId } = await params;
  const session    = await auth();
  const role       = (session?.user as any)?.role;
  const canEdit    = ["SUPER_ADMIN", "REGIONAL_ADMIN"].includes(role);

  const stock = await getStockItem(itemId);
  if (!stock) notFound();

  const batches = await getBatches(stock.item.id);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <a href="/inventory" className="text-gray-400 hover:text-white text-sm transition">
          ← Back
        </a>
        <h1 className="text-xl font-bold text-white">{stock.item.name}</h1>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium
          ${stock.item.category === "WEAPONS" ? "bg-red-500/20 text-red-400"
          : stock.item.category === "FOOD"    ? "bg-green-500/20 text-green-400"
          : "bg-blue-500/20 text-blue-400"}`}>
          {stock.item.category}
        </span>
      </div>

      {/* Item Info */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Item Code",      value: stock.item.code },
            { label: "Base",           value: stock.base.name },
            { label: "Current Stock",  value: `${stock.quantity} ${stock.item.unit}` },
            { label: "Min Threshold",  value: `${stock.item.minThreshold} ${stock.item.unit}` },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-sm text-white font-medium mt-0.5">{value}</p>
            </div>
          ))}
        </div>

        {stock.quantity <= stock.item.minThreshold && (
          <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5 text-sm text-red-400">
            ⚠ Stock is below minimum threshold
          </div>
        )}

        {/* Weapon Specs */}
        {stock.item.category === "WEAPONS" && stock.item.specifications && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2">Specifications</p>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(stock.item.specifications as Record<string, any>).map(
                ([k, v]) => (
                  <div key={k} className="bg-gray-800 rounded-lg px-3 py-2">
                    <p className="text-xs text-gray-500 capitalize">
                      {k.replace(/_/g, " ")}
                    </p>
                    <p className="text-sm text-white font-medium mt-0.5">
                      {String(v)}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit Form */}
      {canEdit && (
        <EditStockForm
          stockId={stock.id}
          currentQty={stock.quantity}
          itemName={stock.item.name}
          unit={stock.item.unit}
        />
      )}

      {/* Batch Panel */}
      <BatchPanel
        batches={batches}
        itemId={stock.item.id}
        category={stock.item.category}
        canEdit={canEdit}
      />
    </div>
  );
}
