// pages/api/consensus/events.ts

import { NextApiRequest, NextApiResponse } from "next";

// Types
interface ConsensusEventPayload {
  zone: string;
  type: "simulation" | "consensus" | "fork";
  origin: string;
  drift: number;
  entropy: number;
  anchor_id?: string;
  meta?: Record<string, any>;
}

interface ConsensusResponse {
  message: string;
  consensusStatus?: "accepted" | "rejected" | "pending";
  simulationAnchor?: string;
  driftEntropyIndex?: number;
  notes?: string;
}

// Handler
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ConsensusResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const payload = req.body as ConsensusEventPayload;
  const { zone, type, drift, entropy, anchor_id } = payload;

  // Default logic
  let status: "accepted" | "rejected" | "pending" = "pending";
  let note = "Awaiting further drift stabilization.";

  if (drift < 0.2 && entropy < 0.3) {
    status = "accepted";
    note = "Drift and entropy within thresholds.";
  } else if (drift > 0.8 || entropy > 0.7) {
    status = "rejected";
    note = "Drift/entropy too high for stable consensus.";
  }

  // 🔁 CE² Zone-specific logic
  if (zone === "ce2") {
    console.log("🔁 CE² Zone event received:", payload);
    note += " [CE²-specific recursive evaluation in progress]";
  }

  return res.status(200).json({
    message: `Event processed for ${zone}`,
    consensusStatus: status,
    simulationAnchor: anchor_id || "none",
    driftEntropyIndex: parseFloat(((drift + entropy) / 2).toFixed(3)),
    notes: note,
  });
}
