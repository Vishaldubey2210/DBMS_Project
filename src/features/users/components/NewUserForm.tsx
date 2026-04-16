// src/features/users/components/NewUserForm.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Unit = { id: string; name: string; level: string };

const ROLES = ["SUPER_ADMIN", "REGIONAL_ADMIN", "BASE_OFFICER", "AUDITOR"];
const LEVELS = ["CENTRAL_COMMAND", "REGIONAL_DEPOT", "ARMY_BASE"];

export function NewUserForm({ units }: { units: Unit[] }) {
  const router  = useRouter();
  const [form, setForm] = useState({
    name: "", email: "", password: "",
    role: "BASE_OFFICER", commandLevel: "ARMY_BASE", unitId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);

  function update(key: string, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const res = await fetch("/api/users", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(form),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to create user");
      return;
    }

    setSuccess(true);
    setForm({ name: "", email: "", password: "", role: "BASE_OFFICER", commandLevel: "ARMY_BASE", unitId: "" });
    router.refresh();
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h2 className="text-sm font-semibold text-white mb-4">Create User</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-3 py-2 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-xs px-3 py-2 rounded-lg">
            ✓ User created successfully
          </div>
        )}

        {[
          { key: "name",     label: "Full Name",  type: "text"     },
          { key: "email",    label: "Email",       type: "email"    },
          { key: "password", label: "Password",    type: "password" },
        ].map(({ key, label, type }) => (
          <div key={key}>
            <label className="block text-xs text-gray-400 mb-1">{label}</label>
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
          <label className="block text-xs text-gray-400 mb-1">Role</label>
          <select
            value={form.role}
            onChange={(e) => update("role", e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>{r.replace(/_/g, " ")}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Command Level</label>
          <select
            value={form.commandLevel}
            onChange={(e) => update("commandLevel", e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition"
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>{l.replace(/_/g, " ")}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Assign Unit</label>
          <select
            value={form.unitId}
            onChange={(e) => update("unitId", e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition"
          >
            <option value="">Select unit...</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition mt-2"
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  );
}
