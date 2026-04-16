// src/app/(dashboard)/inventory/new/page.tsx
import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { redirect } from "next/navigation";
import { NewItemForm } from "@/features/inventory/components/NewItemForm";

export default async function NewInventoryPage() {
  const session = await auth();
  if (!["SUPER_ADMIN", "REGIONAL_ADMIN"].includes((session?.user as any)?.role)) {
    redirect("/inventory");
  }

  const bases = await prisma.unit.findMany({
    where:   { level: "ARMY_BASE" },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <a href="/inventory" className="text-gray-400 hover:text-white text-sm transition">
          ← Back
        </a>
        <h1 className="text-xl font-bold text-white">Add New Item</h1>
      </div>
      <NewItemForm bases={bases} />
    </div>
  );
}
