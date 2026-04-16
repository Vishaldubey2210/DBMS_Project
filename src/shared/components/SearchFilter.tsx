// src/shared/components/SearchFilter.tsx
"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";

type FilterOption = { label: string; value: string };

export function SearchFilter({
  placeholder = "Search...",
  filters = [],
  filterKey = "filter",
}: {
  placeholder?: string;
  filters?: FilterOption[];
  filterKey?: string;
}) {
  const router      = useRouter();
  const pathname    = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1 max-w-xs">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
          🔍
        </span>
        <input
          defaultValue={searchParams.get("q") ?? ""}
          onChange={(e) => update("q", e.target.value)}
          placeholder={placeholder}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500 transition"
        />
      </div>
      {filters.length > 0 && (
        <select
          defaultValue={searchParams.get(filterKey) ?? ""}
          onChange={(e) => update(filterKey, e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition"
        >
          <option value="">All</option>
          {filters.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      )}
      {isPending && (
        <span className="text-xs text-gray-500 animate-pulse">Searching...</span>
      )}
    </div>
  );
}
