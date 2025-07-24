// Simulates dynamic SirrenaSim™ activity events
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const zones = ["SirrenaSim™"];
  const validators = ["Inference-Agent-α", "SimValidator-Ω", "RecursiveNode-07", "LLM-Verifier-X", "BeliefGuard-∆3", "SyntheticReview-Unit", "CognitionPeer-19"];
  const types = [
    "epistemic simulation initialized",
    "synthetic event chain executed",
    "recursive inference loop detected",
    "LLM-generated knowledge block anchored",
    "belief state divergence observed",
    "temporal trajectory recomposed",
    "cross-zone epistemic sync completed",
    "drift replay issued",
    "validator consensus on simulated truth",
    "inference version control snapshot"
  ];

  const generateEvent = () => ({
    zone: zones[0],
    type: types[Math.floor(Math.random() * types.length)],
    timestamp: Date.now(),
    validator: validators[Math.floor(Math.random() * validators.length)]
  });

  // Simulate 7–10 recent events
  const count = Math.floor(Math.random() * 4) + 7;
  const events = Array.from({ length: count }, generateEvent);

  res.status(200).json(events);
}
