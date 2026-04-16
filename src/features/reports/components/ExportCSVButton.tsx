// src/features/reports/components/ExportCSVButton.tsx
"use client";
import { useState } from "react";

export function ExportCSVButton() {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    const res  = await fetch("/api/reports/export");
    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `mims-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setLoading(false);
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
    >
      {loading ? "Exporting..." : "⬇ Export CSV"}
    </button>
  );
}
