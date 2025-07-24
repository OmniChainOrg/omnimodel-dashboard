// Simulates dynamic BioSynthesis™ activity events
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const zones = ["BioSynthesis™"];
  const validators = ["GeneCraft-Delta", "SynBioTracer-88", "LineageLab-9", "CRISPRGuard-AI", "CellForge-X"];
  const types = [
    "Cell line registered",
    "SynBio provenance verified",
    "Gene edit action recorded"
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
