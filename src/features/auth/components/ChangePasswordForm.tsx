// src/features/auth/components/ChangePasswordForm.tsx
"use client";
import { useState } from "react";

export function ChangePasswordForm() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword:     "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg,     setMsg]     = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setMsg({ type: "error", text: "New passwords don't match" });
      return;
    }

    setLoading(true);
    setMsg(null);

    const res = await fetch("/api/users/change-password", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(form),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setMsg({ type: "error", text: data.error ?? "Failed" });
    } else {
      setMsg({ type: "success", text: "Password changed successfully" });
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h2 className="text-sm font-semibold text-white mb-4">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {msg && (
          <div className={`text-xs px-3 py-2 rounded-lg border ${
            msg.type === "success"
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}>
            {msg.text}
          </div>
        )}
        {[
          { key: "currentPassword", label: "Current Password" },
          { key: "newPassword",     label: "New Password"     },
          { key: "confirmPassword", label: "Confirm Password" },
        ].map(({ key, label }) => (
          <div key={key}>
            <label className="block text-xs text-gray-400 mb-1">{label}</label>
            <input
              type="password"
              value={(form as any)[key]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition"
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-60 text-white text-sm font-semibold py-2 rounded-lg transition"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
