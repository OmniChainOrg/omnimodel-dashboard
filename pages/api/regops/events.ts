// Simulates dynamic RegOps™ activity events
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const zones = ["RegOps™"];
  const validators = ["GxP-Agent-3", "RegAudit-Beta", "TrialPhaseBot", "Submission-Node-X", "ComplianceTrace-7"];
  const types = [
    "Regulatory phase advanced",
    "Compliance log updated",
    "Submission received"
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
