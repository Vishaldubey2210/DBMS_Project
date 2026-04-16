// src/app/(dashboard)/users/page.tsx
import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { redirect } from "next/navigation";
import { NewUserForm } from "@/features/users/components/NewUserForm";
import { ToggleUserButton } from "@/features/users/components/ToggleUserButton";

async function getUsers() {
  return await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { unit: { select: { name: true } } },
  });
}

async function getUnits() {
  return await prisma.unit.findMany({ orderBy: { name: "asc" } });
}

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN:    "bg-purple-500/20 text-purple-400",
  REGIONAL_ADMIN: "bg-blue-500/20 text-blue-400",
  BASE_OFFICER:   "bg-green-500/20 text-green-400",
  AUDITOR:        "bg-yellow-500/20 text-yellow-400",
};

export default async function UsersPage() {
  const session = await auth();
  if ((session?.user as any)?.role !== "SUPER_ADMIN") redirect("/");

  const [users, units] = await Promise.all([getUsers(), getUnits()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">User Management</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {users.length} registered users
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* New User Form */}
        <div className="lg:col-span-1">
          <NewUserForm units={units} />
        </div>

        {/* Users Table */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-left">
                    <th className="px-4 py-3 text-gray-400 font-medium">User</th>
                    <th className="px-4 py-3 text-gray-400 font-medium">Role</th>
                    <th className="px-4 py-3 text-gray-400 font-medium">Unit</th>
                    <th className="px-4 py-3 text-gray-400 font-medium">Status</th>
                    <th className="px-4 py-3 text-gray-400 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-800/50 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                            {user.name[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white font-medium">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[user.role]}`}>
                          {user.role.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-xs">
                        {user.unit?.name ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        {user.isActive ? (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                            Active
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
                            Inactive
                          </span>
                        )}
                        {user.lockedUntil && user.lockedUntil > new Date() && (
                          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400">
                            Locked
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <ToggleUserButton
                          userId={user.id}
                          isActive={user.isActive}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
