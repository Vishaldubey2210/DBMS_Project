// src/features/requests/components/NewRequestForm.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Unit = { id: string; name: string };
type Item = { id: string; name: string; unit: string };
type RequestItem = { itemId: string; quantity: number };

export function NewRequestForm({
  units,
  items,
  currentUnitId,
}: {
  units: Unit[];
  items: Item[];
  currentUnitId: string;
}) {
  const router = useRouter();
  const [toUnitId,    setToUnitId]    = useState("");
  const [isEmergency, setIsEmergency] = useState(false);
  const [remarks,     setRemarks]     = useState("");
  const [reqItems,    setReqItems]    = useState<RequestItem[]>([
    { itemId: "", quantity: 1 },
  ]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  function updateItem(index: number, key: keyof RequestItem, value: string | number) {
    setReqItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  }

  function addItem() {
    setReqItems((prev) => [...prev, { itemId: "", quantity: 1 }]);
  }

  function removeItem(index: number) {
    setReqItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/requests", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toUnitId,
        isEmergency,
        remarks,
        items: reqItems.map((i) => ({
          itemId:   i.itemId,
          quantity: Number(i.quantity),
        })),
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to submit request");
      return;
    }

    router.push("/requests");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Emergency Toggle */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => setIsEmergency((v) => !v)}
            className={`w-10 h-6 rounded-full transition-colors relative ${
              isEmergency ? "bg-red-600" : "bg-gray-700"
            }`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
              isEmergency ? "translate-x-5" : "translate-x-1"
            }`} />
          </div>
          <div>
            <p className="text-sm text-white font-medium">Emergency Request</p>
            <p className="text-xs text-gray-500">
              Emergency requests are auto-approved immediately
            </p>
          </div>
        </label>
      </div>

      {/* To Unit */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-medium text-white">Request Destination</h3>
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Send To</label>
          <select
            value={toUnitId}
            onChange={(e) => setToUnitId(e.target.value)}
            required
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition"
          >
            <option value="">Select destination...</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Items */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-white">Requested Items</h3>
          <button
            type="button"
            onClick={addItem}
            className="text-xs text-green-400 hover:text-green-300 transition"
          >
            + Add Item
          </button>
        </div>

        {reqItems.map((ri, i) => (
          <div key={i} className="flex gap-2 items-start">
            <select
              value={ri.itemId}
              onChange={(e) => updateItem(i, "itemId", e.target.value)}
              required
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition"
            >
              <option value="">Select item...</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={1}
              value={ri.quantity}
              onChange={(e) => updateItem(i, "quantity", e.target.value)}
              required
              placeholder="Qty"
              className="w-20 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition"
            />
            {reqItems.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="text-red-400 hover:text-red-300 text-lg leading-none py-2 px-1"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Remarks */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <label className="block text-xs text-gray-400 mb-1.5">
          Remarks (optional)
        </label>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          rows={3}
          placeholder="Add any operational notes..."
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full text-white text-sm font-semibold py-3 rounded-lg transition disabled:opacity-60
          ${isEmergency
            ? "bg-red-600 hover:bg-red-500"
            : "bg-green-600 hover:bg-green-500"
          }`}
      >
        {loading
          ? "Submitting..."
          : isEmergency
          ? "🚨 Submit Emergency Request"
          : "Submit Request"}
      </button>
    </form>
  );
}
