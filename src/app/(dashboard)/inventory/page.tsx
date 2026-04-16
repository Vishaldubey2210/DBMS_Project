// src/app/(dashboard)/inventory/page.tsx
import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import Link from "next/link";
import { Pagination } from "@/shared/components/Pagination";
import { SearchFilter } from "@/shared/components/SearchFilter";

async function getInventory(
  page = 1,
  pageSize = 20,
  query = "",
  category = ""
) {
  const where = {
    item: {
      isDeleted: false,
      ...(category && { category: category as any }),
      ...(query && {
        OR: [
          { name: { contains: query, mode: "insensitive" as const } },
          { code: { contains: query, mode: "insensitive" as const } },
        ],
      }),
    },
  };

  const [items, total] = await Promise.all([
    prisma.stockItem.findMany({
      where,
      include: {
        item: true,
        base: { select: { name: true, level: true } },
      },
      orderBy: { lastUpdated: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.stockItem.count({ where }),
  ]);

  return { items, total };
}

const CATEGORY_COLORS: Record<string, string> = {
  WEAPONS: "bg-red-500/20 text-red-400",
  FOOD: "bg-green-500/20 text-green-400",
  MEDICAL: "bg-blue-500/20 text-blue-400",
};

const CATEGORY_ICONS: Record<string, string> = {
  WEAPONS: "🔫",
  FOOD: "🍱",
  MEDICAL: "💊",
};

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: { page?: string; q?: string; filter?: string };
}) {
  const page = Number(searchParams?.page ?? 1);
  const query = searchParams?.q ?? "";
  const category = searchParams?.filter ?? "";

  const session = await auth();
  const role = (session?.user as any)?.role;
  const canEdit = ["SUPER_ADMIN", "REGIONAL_ADMIN"].includes(role);

  const { items: inventory, total } = await getInventory(
    page,
    20,
    query,
    category
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Inventory</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Stock levels across all bases
          </p>
        </div>
        {canEdit && (
          <Link
            href="/inventory/new"
            className="bg-green-600 hover:bg-green-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            + Add Item
          </Link>
        )}
      </div>

      {/* Search + Filter */}
      <SearchFilter
        placeholder="Search items..."
        filterKey="filter"
        filters={[
          { label: "Weapons", value: "WEAPONS" },
          { label: "Food", value: "FOOD" },
          { label: "Medical", value: "MEDICAL" },
        ]}
      />

      {/* Category Stats */}
      <div className="grid grid-cols-3 gap-4">
        {["WEAPONS", "FOOD", "MEDICAL"].map((cat) => {
          const count = inventory.filter(
            (i) => i.item.category === cat
          ).length;

          const totalQty = inventory
            .filter((i) => i.item.category === cat)
            .reduce((sum, i) => sum + i.quantity, 0);

          return (
            <div
              key={cat}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <span>{CATEGORY_ICONS[cat]}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[cat]}`}
                >
                  {cat}
                </span>
              </div>
              <p className="text-2xl font-bold text-white">
                {totalQty.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {count} stock entries
              </p>
            </div>
          );
        })}
      </div>

      {/* Inventory Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-left">
                <th className="px-4 py-3 text-gray-400 font-medium">Item</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Category</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Base</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Quantity</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Status</th>
                {canEdit && (
                  <th className="px-4 py-3 text-gray-400 font-medium">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {inventory.map((stock) => {
                const isLow =
                  stock.quantity <= stock.item.minThreshold;

                return (
                  <tr
                    key={stock.id}
                    className="hover:bg-gray-800/50 transition"
                  >
                    <td className="px-4 py-3">
                      <p className="text-white font-medium">
                        {stock.item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {stock.item.code}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[stock.item.category]}`}
                      >
                        {CATEGORY_ICONS[stock.item.category]}{" "}
                        {stock.item.category}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <p className="text-white">{stock.base.name}</p>
                      <p className="text-xs text-gray-500">
                        {stock.base.level.replace("_", " ")}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <p
                        className={`font-bold ${
                          isLow ? "text-red-400" : "text-white"
                        }`}
                      >
                        {stock.quantity.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Min: {stock.item.minThreshold}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      {isLow ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-medium">
                          ⚠ Low Stock
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-medium">
                          ✓ Adequate
                        </span>
                      )}
                    </td>

                    {canEdit && (
                      <td className="px-4 py-3">
                        <Link
                          href={`/inventory/${stock.id}`}
                          className="text-xs text-blue-400 hover:text-blue-300 transition"
                        >
                          Edit →
                        </Link>
                      </td>
                    )}
                  </tr>
                );
              })}

              {inventory.length === 0 && (
                <tr>
                  <td
                    colSpan={canEdit ? 6 : 5}
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    No inventory items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <Pagination total={total} page={page} pageSize={20} />
    </div>
  );
}
