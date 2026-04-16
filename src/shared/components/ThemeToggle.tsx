// src/shared/components/ThemeToggle.tsx
"use client";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    // Read saved preference on mount
    const saved = localStorage.getItem("theme");
    const isDark = saved ? saved === "dark" : true; // default dark
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  // Avoid hydration mismatch — render nothing until mounted
  if (dark === null) return <div className="w-8 h-8" />;

  return (
    <button
      onClick={toggle}
      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition"
      title={dark ? "Switch to Light" : "Switch to Dark"}
    >
      {dark ? "🌙" : "☀️"}
    </button>
  );
}
