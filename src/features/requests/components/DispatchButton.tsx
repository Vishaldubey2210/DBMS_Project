// src/features/requests/components/DispatchButton.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function DispatchButton({ requestId }: { requestId: string }) {
  const router  = useRouter();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  async function handleDispatch() {
    if (!confirm("Confirm dispatch? This will update stock levels.")) return;
    setLoading(true);
    setError("");

    const res = await fetch(`/api/requests/${requestId}/dispatch`, {
      method: "POST",
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Dispatch failed");
      return;
    }

    router.push("/requests");
    router.refresh();
  }

  return (
    <div className="space-y-2">
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
      <button
        onClick={handleDispatch}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition"
      >
        {loading ? "Dispatching..." : "🚚 Mark as Dispatched"}
      </button>
    </div>
  );
}
