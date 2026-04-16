// src/features/inventory/components/NewItemForm.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Base = { id: string; name: string };

export function NewItemForm({ bases }: { bases: Base[] }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name:         "",
    code:         "",
    category:     "WEAPONS",
    unit:         "units",
    minThreshold: 10,
    baseId:       "",
    initialQty:   0,
    // weapon specs
    caliber:      "",
    capacity:     "",
    weight_kg:    "",
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  function update(key: string, value: any) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const specifications =
      form.category === "WEAPONS" && form.caliber
        ? { caliber: form.caliber, capacity: Number(form.capacity), weight_kg: Number(form.weight_kg) }
        : undefined;

    // Create item
    const itemRes = await fetch("/api/inventory", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name:         form.name,
        code:         form.code,
        category:     form.category,
        unit:         form.unit,
        minThreshold: Number(form.minThreshold),
        specifications,
      }),
    });

    if (!itemRes.ok) {
      const data = await itemRes.json();
      setError(JSON.stringify(data.error));
      setLoading(false);
      return;
    }

    const { data: item } = await itemRes.json();

    // Create initial stock entry
    if (form.baseId && form.initialQty > 0) {
      await fetch("/api/stock", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId:   item.id,
          baseId:   form.baseId,
          quantity: Number(form.initialQty),
        }),
      });
    }

    setLoading(false);
    router.push("/inventory");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white">Item Details</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { key: "name", label: "Item Name",  type: "text" },
            { key: "code", label: "Item Code",  type: "text" },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label className="block text-xs text-gray-400 mb-1.5">{label}</label>
              <input
                type={type}
                value={(form as any)[key]}
                onChange={(e) => update(key, e.target.value)}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition"
              />
            </div>
          ))}

          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Category</label>
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition"
            >
              <option value="WEAPONS">🔫 Weapons</option>
              <option value="FOOD">🍱 Food</option>
              <option value="MEDICAL">💊 Medical</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Unit</label>
            <select
              value={form.unit}
              onChange={(e) => update("unit", e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition"
            >
              <option value="units">units</option>
              <option value="kg">kg</option>
              <option value="litres">litres</option>
              <option value="packs">packs</option>
              <option value="vials">vials</option>
              <option value="boxes">boxes</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Min Threshold</label>
            <input
              type="number"
              min={1}
              value={form.minThreshold}
              onChange={(e) => update("minThreshold", e.target.value)}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Weapon Specs */}
      {form.category === "WEAPONS" && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white">
            Weapon Specifications
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { key: "caliber",   label: "Caliber",    type: "text"   },
              { key: "capacity",  label: "Capacity",   type: "number" },
              { key: "weight_kg", label: "Weight (kg)",type: "number" },
            ].map(({ key, label, type }) => (
              <div key={key}>
                <label className="block text-xs text-gray-400 mb-1.5">{label}</label>
                <input
                  type={type}
                  value={(form as any)[key]}
                  onChange={(e) => update(key, e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Initial Stock */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white">
          Initial Stock Assignment
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Assign to Base</label>
            <select
              value={form.baseId}
              onChange={(e) => update("baseId", e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition"
            >
              <option value="">Select base...</option>
              {bases.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Initial Quantity</label>
            <input
              type="number"
              min={0}
              value={form.initialQty}
              onChange={(e) => update("initialQty", e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-60 text-white text-sm font-semibold py-3 rounded-lg transition"
      >
        {loading ? "Creating..." : "Create Item"}
      </button>
    </form>
  );
}
