"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  ArrowRightLeft,
  Bell,
  Shield,
  FileText,
  Users,
  LogOut,
  History,
  User,
} from "lucide-react";
import { signOut } from "next-auth/react";

const NAV = [
  {
    href: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["SUPER_ADMIN", "REGIONAL_ADMIN", "BASE_OFFICER", "AUDITOR"],
  },
  {
    href: "/inventory",
    label: "Inventory",
    icon: Package,
    roles: ["SUPER_ADMIN", "REGIONAL_ADMIN", "BASE_OFFICER", "AUDITOR"],
  },
  {
    href: "/requests",
    label: "Requests",
    icon: ClipboardList,
    roles: ["SUPER_ADMIN", "REGIONAL_ADMIN", "BASE_OFFICER"],
  },
  {
    href: "/transfers",
    label: "Transfers",
    icon: ArrowRightLeft,
    roles: ["SUPER_ADMIN", "REGIONAL_ADMIN", "BASE_OFFICER"],
  },
  {
    href: "/alerts",
    label: "Alerts",
    icon: Bell,
    roles: ["SUPER_ADMIN", "REGIONAL_ADMIN", "BASE_OFFICER"],
  },
  {
    href: "/audit",
    label: "Audit Trail",
    icon: Shield,
    roles: ["SUPER_ADMIN", "AUDITOR"],
  },
  {
    href: "/login-history",
    label: "Login History",
    icon: History,
    roles: ["SUPER_ADMIN", "AUDITOR"],
  },
  {
    href: "/reports",
    label: "Reports",
    icon: FileText,
    roles: ["SUPER_ADMIN", "REGIONAL_ADMIN", "AUDITOR"],
  },
  {
    href: "/users",
    label: "Users",
    icon: Users,
    roles: ["SUPER_ADMIN"],
  },
  {
    href: "/profile",
    label: "My Profile",
    icon: User,
    roles: ["SUPER_ADMIN", "REGIONAL_ADMIN", "BASE_OFFICER", "AUDITOR"],
  },
];

export function Sidebar({ role }: { role: string }) {
  const path = usePathname();

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center text-lg">
            🛡️
          </div>
          <div>
            <p className="font-bold text-white text-sm leading-tight">
              MIMS
            </p>
            <p className="text-[10px] text-gray-500">
              Indian Army Logistics
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.filter((n) => n.roles.includes(role)).map(
          ({ href, label, icon: Icon }) => {
            const active =
              path === href ||
              (href !== "/" && path.startsWith(href));

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                ${
                  active
                    ? "bg-green-600 text-white font-medium"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </Link>
            );
          }
        )}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-800">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
