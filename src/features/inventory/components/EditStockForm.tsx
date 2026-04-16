// src/features/inventory/components/EditStockForm.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function EditStockForm({
  stockId,
  currentQty,
  itemName,
  unit,
}: {
  stockId: string;
  currentQty: number;
  itemName: string;
  unit: string;
}) {
  const router    = useRouter();
  const [qty,     setQty]     = useState(currentQty);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const res = await fetch(`/api/inventory/${stockId}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ quantity: qty }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Update failed");
      return;
    }

    setSuccess(true);
    router.refresh();
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h2 className="text-sm font-semibold text-white mb-4">Update Stock</h2>
      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}
        {success && (
          <p className="text-xs text-green-400">✓ Updated</p>
        )}
        <div className="flex-1">
          <label className="block text-xs text-gray-400 mb-1.5">
            New Quantity ({unit})
          </label>
          <input
            type="number"
            min={0}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-500 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2 rounded-lg transition"
        >
          {loading ? "Saving..." : "Update"}
        </button>
      </form>
    </div>
  );
}
