// pages/api/sirrenasim/posterior.ts

import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Data types for the Posterior API
 */
interface Forecast {
  zone: string;
  prediction: number;
  probability: number;
  method: "variational" | "sampling";
  meta: {
    epistemic_friction_score: number;
    isaad_alignment_delta: number;
    recursive_echo_index: number;
  };
}
interface ConfidencePoint {
  timestamp: string;
  confidence: number;
}
interface BeliefPoint {
  event_type: string;
  timestamp: string;
  prior: number;
  posterior: number;
  meta: {
    cause: string;
    inference_method: "variational" | "sampling";
    epistemic_friction_score: number;
    isaad_alignment_delta: number;
    recursive_echo_index: number;
  };
}
interface MemoryTraceEntry {
  label: string;
  timestamp: string;
  anchor_id: string;
  snapshot: string;
}

/**
 * The JSON shape returned by the /posterior endpoint
 */
export interface PosteriorData {
  forecasts: Forecast[];
  confidenceTimeline: ConfidencePoint[];
  beliefPath: BeliefPoint[];
  memoryTrace: MemoryTraceEntry[];
  warning?: string;
}

/**
 * Handler for /api/sirrenasim/posterior?zone=<zoneName>
 * Applies optional fallback logic if zone is missing.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PosteriorData | { error: string; warning?: string }>
) {
  const rawZone = req.query.zone;
  const enableFallback = process.env.NEXT_PUBLIC_ENABLE_ZONE_FALLBACK === "true";

  let zone: string | undefined =
    Array.isArray(rawZone) ? rawZone[0] : (rawZone as string | undefined);

  let warning: string | undefined;
  if (!zone) {
    if (!enableFallback) {
      return res.status(400).json({ error: "Missing required `zone` parameter" });
    }
    zone = "Zone A";
    warning = "Missing 'zone' parameter—defaulted to 'Zone A'";
    console.warn(`[posterior] fallback applied: ${warning}`);
  }

  const now = Date.now();

  // Generate stubbed data (replace with real SirrenaSim integration)
  const forecasts: Forecast[] = Array.from({ length: 3 }, (_, i) => ({
    zone: zone!,
    prediction: parseFloat((Math.random() * 100).toFixed(2)),
    probability: parseFloat(Math.random().toFixed(2)),
    method: i % 2 === 0 ? "variational" : "sampling",
    meta: {
      epistemic_friction_score: parseFloat(Math.random().toFixed(2)),
      isaad_alignment_delta: parseFloat(Math.random().toFixed(2)),
      recursive_echo_index: parseFloat(Math.random().toFixed(2)),
    },
  }));

  const confidenceTimeline: ConfidencePoint[] = forecasts.map((_, i) => ({
    timestamp: new Date(now + i * 60000).toISOString(),
    confidence: parseFloat(Math.random().toFixed(2)),
  }));

  const beliefPath: BeliefPoint[] = forecasts.map((f, i) => ({
    event_type: `Event ${i + 1}`,
    timestamp: new Date(now + i * 2 * 60000).toISOString(),
    prior: parseFloat(Math.random().toFixed(2)),
    posterior: parseFloat(Math.random().toFixed(2)),
    meta: {
      cause: "auto",
      inference_method: f.method,
      epistemic_friction_score: parseFloat(Math.random().toFixed(2)),
      isaad_alignment_delta: parseFloat(Math.random().toFixed(2)),
      recursive_echo_index: parseFloat(Math.random().toFixed(2)),
    },
  }));

  const response: PosteriorData = {
  forecasts: [...], // your existing data
  confidenceTimeline: [...],
  beliefPath: [...],
  memoryTrace: [...],
  intuitionTrace: [
    {
      timestamp: new Date().toISOString(),
      traceSource: "OracleSigIL::Layer-8:EchoFlow",
      insightType: "hybrid",
      confidenceDelta: 0.14,
      epistemicBadge: "Recursive Heuristic Lift v1.0"
    },
    {
      timestamp: new Date().toISOString(),
      traceSource: "NeuroMetaPulse",
      insightType: "felt",
      confidenceDelta: -0.05,
      epistemicBadge: "Intuitive Drift Flag"
    },
  }));

  const memoryTrace: MemoryTraceEntry[] = Array.from({ length: 2 }, (_, i) => ({
    label: `State ${i}`,
    timestamp: new Date(now + i * 3 * 60000).toISOString(),
    anchor_id: `anchor${i}`,
    snapshot: JSON.stringify({ zone: zone!, step: i }),
  }));

  const payload: PosteriorData = {
    forecasts,
    confidenceTimeline,
    beliefPath,
    memoryTrace,
  };
  if (warning) payload.warning = warning;

  return res.status(200).json(payload);
}
