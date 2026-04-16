// src/shared/components/Pagination.tsx
"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function Pagination({
  total,
  page,
  pageSize = 20,
}: {
  total: number;
  page: number;
  pageSize?: number;
}) {
  const router      = useRouter();
  const pathname    = usePathname();
  const searchParams = useSearchParams();
  const totalPages  = Math.ceil(total / pageSize);

  function goTo(p: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`${pathname}?${params.toString()}`);
  }

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-1">
      <p className="text-xs text-gray-500">
        Showing {(page - 1) * pageSize + 1}–
        {Math.min(page * pageSize, total)} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => goTo(page - 1)}
          disabled={page === 1}
          className="px-3 py-1.5 text-xs rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          ← Prev
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const p = i + 1;
          return (
            <button
              key={p}
              onClick={() => goTo(p)}
              className={`w-8 h-8 text-xs rounded-lg transition ${
                p === page
                  ? "bg-green-600 text-white"
                  : "border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500"
              }`}
            >
              {p}
            </button>
          );
        })}
        <button
          onClick={() => goTo(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1.5 text-xs rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
