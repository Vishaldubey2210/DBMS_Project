// src/features/transfers/components/NewTransferForm.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Unit = { id: string; name: string };
type Item = { id: string; name: string; unit: string };

export function NewTransferForm({
  units,
  items,
  currentUnitId,
}: {
  units: Unit[];
  items: Item[];
  currentUnitId: string;
}) {
  const router = useRouter();
  const [toUnitId,  setToUnitId]  = useState("");
  const [itemId,    setItemId]    = useState("");
  const [quantity,  setQuantity]  = useState(1);
  const [remarks,   setRemarks]   = useState("");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [success,   setSuccess]   = useState(false);

  const otherUnits = units.filter((u) => u.id !== currentUnitId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const res = await fetch("/api/transfers", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toUnitId,
        itemId,
        quantity,
        remarks,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Transfer failed");
      return;
    }

    setSuccess(true);
    setToUnitId("");
    setItemId("");
    setQuantity(1);
    setRemarks("");
    router.refresh();
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h2 className="text-sm font-semibold text-white mb-4">
        New Transfer
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-3 py-2 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-xs px-3 py-2 rounded-lg">
            ✓ Transfer initiated successfully
          </div>
        )}

        <div>
          <label className="block text-xs text-gray-400 mb-1.5">
            Destination Base
          </label>
          <select
            value={toUnitId}
            onChange={(e) => setToUnitId(e.target.value)}
            required
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition"
          >
            <option value="">Select base...</option>
            {otherUnits.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Item</label>
          <select
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            required
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition"
          >
            <option value="">Select item...</option>
            {items.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name} ({i.unit})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1.5">
            Quantity
          </label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition"
          />
        </div>

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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition"
        >
          {loading ? "Processing..." : "Initiate Transfer"}
        </button>
      </form>
    </div>
  );
}
