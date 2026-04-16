// src/app/(dashboard)/requests/new/page.tsx
import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { NewRequestForm } from "@/features/requests/components/NewRequestForm";

async function getFormData() {
  const [units, items] = await Promise.all([
    prisma.unit.findMany({
      where: { level: { in: ["REGIONAL_DEPOT", "CENTRAL_COMMAND"] } },
    }),
    prisma.item.findMany({ where: { isDeleted: false } }),
  ]);
  return { units, items };
}

export default async function NewRequestPage() {
  const session = await auth();
  const { units, items } = await getFormData();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-white">New Supply Request</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Submit a request to Regional Depot or Central Command
        </p>
      </div>
      <NewRequestForm
        units={units}
        items={items}
        currentUnitId={(session?.user as any)?.unitId}
      />
    </div>
  );
}
