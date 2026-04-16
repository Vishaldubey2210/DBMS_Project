// src/features/alerts/components/MarkAlertRead.tsx
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function MarkAlertRead({
  alertId,
  isRead,
}: {
  alertId: string;
  isRead: boolean;
}) {
  const router  = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    await fetch(`/api/alerts/${alertId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead: !isRead }),
    });
    setLoading(false);
    router.refresh();
  }

  if (isRead) return null;

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-2.5 py-1 rounded-lg transition disabled:opacity-50"
    >
      {loading ? "..." : "Mark Read"}
    </button>
  );
}
