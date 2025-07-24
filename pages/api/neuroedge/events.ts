// Simulates dynamic NEUROEdge™ activity events
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const zones = ["NEUROEdge™"];
  const validators = ["NeuroSync-01", "BCI-Validator-Δ", "CognitiveMap-AI", "CortexTrace-77", "SynapseGuardian-X"];
  const types = [
    "BCI input registered",
    "Cognition index updated",
    "Neural trace logged"
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
