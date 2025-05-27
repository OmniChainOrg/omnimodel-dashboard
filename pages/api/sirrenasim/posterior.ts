import type { NextApiRequest, NextApiResponse } from "next";

// … (your PosteriorData type) …

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PosteriorData | { error: string; warning?: string }>
) {
  const rawZone = req.query.zone;
  let zone: string | undefined =
    Array.isArray(rawZone) ? rawZone[0] : (rawZone as string | undefined);

  const enableFallback = process.env.NEXT_PUBLIC_ENABLE_ZONE_FALLBACK === "true";

  // Fallback logic
  let warning: string | undefined;
  if (!zone) {
    if (!enableFallback) {
      return res.status(400).json({ error: "Missing required `zone` parameter" });
    }
    zone = "Zone A";  // your chosen default
    warning = "`zone` missing—defaulted to Zone A";
    // Log it on the server
    console.warn(`[posterior] fallback applied: ${warning}`);
  }

  const now = Date.now();
  // … build forecasts, confidenceTimeline, beliefPath, memoryTrace …
  const forecasts = Array.from({ length: 3 }, (_, i) => ({
    zone,
    prediction: Math.random() * 100,
    probability: Math.random(),
    method: i % 2 === 0 ? "variational" : "sampling",
    meta: { /* … */ },
  }));
  // ... rest of your stub or real logic ...

  // Return with optional warning field
  const payload = { forecasts, /* … */ } as PosteriorData & { warning?: string };
  if (warning) payload.warning = warning;
  return res.status(200).json(payload);
}
