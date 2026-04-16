import { NextRequest } from "next/server";
import { LRUCache } from "lru-cache";

const limiter = new LRUCache<string, number[]>({ max: 500 });

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 60;

export async function rateLimit(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const now = Date.now();
  const hits = (limiter.get(ip) ?? []).filter(t => now - t < WINDOW_MS);

  if (hits.length >= MAX_REQUESTS) {
    throw new Response(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }

  limiter.set(ip, [...hits, now]);
}
