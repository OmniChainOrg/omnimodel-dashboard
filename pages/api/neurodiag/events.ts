// Simulates NEURODiag™ system events
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json([
    {
      type: "synaptic baseline anomaly",
      timestamp: Date.now(),
      zone: "NEURODiag™"
    },
    {
      type: "cognition drift corrected",
      timestamp: Date.now(),
      zone: "NEURODiag™"
    },
    {
      type: "neuroplasticity threshold breached",
      timestamp: Date.now(),
      zone: "NEURODiag™"
    },
    {
      type: "cortical marker normalized",
      timestamp: Date.now(),
      zone: "NEURODiag™"
    },
    {
      type: "neurotransmitter alignment synced",
      timestamp: Date.now(),
      zone: "NEURODiag™"
    },
  ]);
}
