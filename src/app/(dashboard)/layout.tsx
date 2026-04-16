// src/app/(dashboard)/layout.tsx
import { auth } from "@/shared/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/shared/components/Sidebar";
import { Topbar } from "@/shared/components/Topbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden">
      <Sidebar role={(session.user as any).role} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar user={session.user as any} />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-950">
          {children}
        </main>
      </div>
    </div>
  );
}
