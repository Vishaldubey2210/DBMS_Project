// src/features/users/components/ToggleUserButton.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function ToggleUserButton({
  userId,
  isActive,
}: {
  userId: string;
  isActive: boolean;
}) {
  const router  = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    await fetch(`/api/users/${userId}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ isActive: !isActive }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`text-xs px-2.5 py-1 rounded-lg border transition disabled:opacity-50
        ${isActive
          ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
          : "border-green-500/30 text-green-400 hover:bg-green-500/10"
        }`}
    >
      {loading ? "..." : isActive ? "Deactivate" : "Activate"}
    </button>
  );
}
