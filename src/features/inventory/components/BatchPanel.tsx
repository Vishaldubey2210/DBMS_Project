// src/features/inventory/components/BatchPanel.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Batch = {
  id: string;
  batchCode: string;
  remainingQty: number;
  expiryDate: Date | null;
  maintenanceDueDate: Date | null;
  receivedAt: Date;
};

export function BatchPanel({
  batches,
  itemId,
  category,
  canEdit,
}: {
  batches: Batch[];
  itemId: string;
  category: string;
  canEdit: boolean;
}) {
  const router  = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    batchCode: "",
    quantity: 1,
    expiryDate: "",
    maintenanceDueDate: "",
    manufactureDate: "",
  });
  const [loading, setLoading] = useState(false);

  async function handleAddBatch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/batches", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemId,
        ...form,
        quantity:    Number(form.quantity),
        remainingQty: Number(form.quantity),
      }),
    });

    setLoading(false);
    setShowForm(false);
    setForm({ batchCode: "", quantity: 1, expiryDate: "", maintenanceDueDate: "", manufactureDate: "" });
    router.refresh();
  }

  const isExpiringSoon = (date: Date | null) => {
    if (!date) return false;
    return new Date(date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">
          Batch Tracking (FIFO)
        </h2>
        {canEdit && (
          <button
            onClick={() => setShowForm((v) => !v)}
            className="text-xs text-green-400 hover:text-green-300 transition"
          >
            {showForm ? "Cancel" : "+ Add Batch"}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleAddBatch} className="px-5 py-4 border-b border-gray-800 space-y-3 bg-gray-800/30">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Batch Code</label>
              <input
                value={form.batchCode}
                onChange={(e) => setForm((f) => ({ ...f, batchCode: e.target.value }))}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Quantity</label>
              <input
                type="number"
                min={1}
                value={form.quantity}
                onChange={(e) => setForm((f) => ({ ...f, quantity: Number(e.target.value) }))}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition"
              />
            </div>
            {category === "FOOD" || category === "MEDICAL" ? (
              <>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Manufacture Date</label>
                  <input
                    type="date"
                    value={form.manufactureDate}
                    onChange={(e) => setForm((f) => ({ ...f, manufactureDate: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={form.expiryDate}
                    onChange={(e) => setForm((f) => ({ ...f, expiryDate: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition"
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs text-gray-400 mb-1">Maintenance Due Date</label>
                <input
                  type="date"
                  value={form.maintenanceDueDate}
                  onChange={(e) => setForm((f) => ({ ...f, maintenanceDueDate: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition"
                />
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-500 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            {loading ? "Adding..." : "Add Batch"}
          </button>
        </form>
      )}

      <div className="divide-y divide-gray-800">
        {batches.map((batch, i) => (
          <div key={batch.id} className="px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded font-mono">
                #{i + 1}
              </span>
              <div>
                <p className="text-sm text-white font-medium">{batch.batchCode}</p>
                <p className="text-xs text-gray-500">
                  Received: {new Date(batch.receivedAt).toLocaleDateString("en-IN")}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-white">{batch.remainingQty} remaining</p>
              {batch.expiryDate && (
                <p className={`text-xs mt-0.5 ${isExpiringSoon(batch.expiryDate) ? "text-orange-400" : "text-gray-500"}`}>
                  {isExpiringSoon(batch.expiryDate) ? "⚠ " : ""}
                  Exp: {new Date(batch.expiryDate).toLocaleDateString("en-IN")}
                </p>
              )}
              {batch.maintenanceDueDate && (
                <p className={`text-xs mt-0.5 ${isExpiringSoon(batch.maintenanceDueDate) ? "text-yellow-400" : "text-gray-500"}`}>
                  {isExpiringSoon(batch.maintenanceDueDate) ? "🔧 " : ""}
                  Maint: {new Date(batch.maintenanceDueDate).toLocaleDateString("en-IN")}
                </p>
              )}
            </div>
          </div>
        ))}
        {batches.length === 0 && (
          <div className="px-5 py-8 text-center text-gray-500 text-sm">
            No active batches.
          </div>
        )}
      </div>
    </div>
  );
}
