// pages/api/sirrenasim/posterior.ts
import type { NextApiRequest, NextApiResponse } from "next";

export type Forecast = {
  zone: string;
  prediction: number;
  probability: number;
  method: "variational" | "sampling";
  meta: {
    epistemic_friction_score: number;
    isaad_alignment_delta: number;
    recursive_echo_index: number;
  };
};

export type ConfidencePoint = { timestamp: string; confidence: number };
export type BeliefPoint = {
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
};
export type MemoryTraceEntry = {
  label: string;
  timestamp: string;
  anchor_id: string;
  snapshot: string;
};

export type PosteriorData = {
  forecasts: Forecast[];
  confidenceTimeline: ConfidencePoint[];
  beliefPath: BeliefPoint[];
  memoryTrace: MemoryTraceEntry[];
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<PosteriorData>
) {
  res.status(200).json({
    forecasts: [
      {
        zone: "Zone A",
        prediction: 42,
        probability: 0.8,
        method: "variational",
        meta: {
          epistemic_friction_score: 0.3,
          isaad_alignment_delta: 0.1,
          recursive_echo_index: 0.05,
        },
      },
      {
        zone: "Zone B",
        prediction: 73,
        probability: 0.6,
        method: "sampling",
        meta: {
          epistemic_friction_score: 0.4,
          isaad_alignment_delta: 0.2,
          recursive_echo_index: 0.07,
        },
      },
    ],
    confidenceTimeline: [
      { timestamp: new Date().toISOString(), confidence: 0.8 },
      { timestamp: new Date(Date.now() + 3600e3).toISOString(), confidence: 0.85 },
    ],
    beliefPath: [
      {
        event_type: "Event 1",
        timestamp: new Date().toISOString(),
        prior: 0.5,
        posterior: 0.6,
        meta: {
          cause: "cause X",
          inference_method: "variational",
          epistemic_friction_score: 0.2,
          isaad_alignment_delta: 0.05,
          recursive_echo_index: 0.02,
        },
      },
      {
        event_type: "Event 2",
        timestamp: new Date().toISOString(),
        prior: 0.6,
        posterior: 0.7,
        meta: {
          cause: "cause Y",
          inference_method: "sampling",
          epistemic_friction_score: 0.25,
          isaad_alignment_delta: 0.07,
          recursive_echo_index: 0.03,
        },
      },
    ],
    memoryTrace: [
      {
        label: "Step 1",
        timestamp: new Date().toISOString(),
        anchor_id: "anchor123",
        snapshot: "State at T0",
      },
      {
        label: "Step 2",
        timestamp: new Date().toISOString(),
        anchor_id: "anchor456",
        snapshot: "State at T1",
      },
    ],
  });
}
