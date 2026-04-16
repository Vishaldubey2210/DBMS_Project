// src/features/requests/components/ApproveRejectButtons.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function ApproveRejectButtons({ requestId }: { requestId: string }) {
  const router  = useRouter();
  const [remarks,  setRemarks]  = useState("");
  const [loading,  setLoading]  = useState<"APPROVED" | "REJECTED" | null>(null);
  const [error,    setError]    = useState("");

  async function handleAction(action: "APPROVED" | "REJECTED") {
    setLoading(action);
    setError("");

    const res = await fetch(`/api/requests/${requestId}/approve`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ action, remarks }),
    });

    setLoading(null);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Action failed");
      return;
    }

    router.push("/requests");
    router.refresh();
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
      <h2 className="text-sm font-semibold text-white">Take Action</h2>
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-3 py-2 rounded-lg">
          {error}
        </div>
      )}
      <div>
        <label className="block text-xs text-gray-400 mb-1.5">
          Remarks (optional)
        </label>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          rows={2}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition resize-none"
        />
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => handleAction("APPROVED")}
          disabled={!!loading}
          className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition"
        >
          {loading === "APPROVED" ? "Approving..." : "✓ Approve"}
        </button>
        <button
          onClick={() => handleAction("REJECTED")}
          disabled={!!loading}
          className="flex-1 bg-red-600/80 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition"
        >
          {loading === "REJECTED" ? "Rejecting..." : "✕ Reject"}
        </button>
      </div>
    </div>
  );
}
