// src/shared/components/Topbar.tsx

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  REGIONAL_ADMIN: "Regional Admin",
  BASE_OFFICER: "Base Officer",
  AUDITOR: "Auditor",
};

export async function Topbar() {
  const session = await auth();
  const userId = (session?.user as any)?.userId;

  const user = userId
    ? await prisma.user.findUnique({
        where: { id: userId },
        select: {
          name: true,
          role: true,
          avatarUrl: true,
        },
      })
    : null;

  const roleLabel =
    user?.role ? ROLE_LABELS[user.role] ?? user.role : "";

  return (
    <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6 flex-shrink-0">
      {/* Left Spacer (for layout alignment) */}
      <div />

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <ThemeToggle />

        <Link
          href="/profile"
          className="flex items-center gap-3 hover:opacity-80 transition"
        >
          {/* Avatar */}
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name ?? "User"}
              className="w-8 h-8 rounded-full object-cover border border-gray-700"
            />
          ) : (
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
          )}

          {/* Name + Role */}
          <div className="hidden sm:block text-right leading-tight">
            <p className="text-sm text-white font-medium">
              {user?.name ?? "User"}
            </p>
            <p className="text-xs text-gray-500">
              {roleLabel}
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}
