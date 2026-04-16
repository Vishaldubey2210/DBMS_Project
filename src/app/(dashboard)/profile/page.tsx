// src/app/(dashboard)/profile/page.tsx

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { ChangePasswordForm } from "@/features/auth/components/ChangePasswordForm";
import { AvatarUpload } from "@/features/auth/components/AvatarUpload";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userId = (session.user as any)?.userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      unit: { select: { name: true, level: true } },
      loginHistories: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-xl font-bold text-white">My Profile</h1>

      {/* Profile Card */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center gap-5">
          {/* ✅ Avatar Upload Integrated */}
          <AvatarUpload
            currentUrl={user.avatarUrl ?? null}
            userName={user.name}
          />

          <div>
            <h2 className="text-lg font-bold text-white">
              {user.name}
            </h2>
            <p className="text-sm text-gray-400">
              {user.email}
            </p>

            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-medium">
                {user.role.replace(/_/g, " ")}
              </span>

              {user.unit && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">
                  {user.unit.name}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-800">
          {[
            {
              label: "Command Level",
              value: user.commandLevel.replace(/_/g, " "),
            },
            {
              label: "Account Status",
              value: user.isActive ? "Active" : "Inactive",
            },
            {
              label: "Member Since",
              value: new Date(user.createdAt).toLocaleDateString("en-IN"),
            },
            {
              label: "Failed Attempts",
              value: user.failedAttempts,
            },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-sm text-white mt-0.5">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Change Password */}
      <ChangePasswordForm />

      {/* Recent Logins */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4">
          Recent Logins
        </h2>

        <div className="space-y-2">
          {user.loginHistories.length === 0 && (
            <p className="text-xs text-gray-500">
              No login history found.
            </p>
          )}

          {user.loginHistories.map((h) => (
            <div
              key={h.id}
              className="flex items-center justify-between"
            >
              <p className="text-xs text-gray-400">
                {new Date(h.createdAt).toLocaleString(
                  "en-IN"
                )}
              </p>

              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  h.success
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {h.success ? "✓ Success" : "✕ Failed"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
