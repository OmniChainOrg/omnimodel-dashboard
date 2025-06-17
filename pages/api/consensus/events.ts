//events.ts
export default function handler(req, res) {
  res.status(200).json([
    {
      id: 1,
      zone: "TradePharma",
      action: "belief_update",
      timestamp: "2025-06-17T00:00:00Z",
      payload: { alignmentScore: 0.91 }
    },
    {
      id: 2,
      zone: "SirrenaSim",
      action: "anchor_shift",
      timestamp: "2025-06-17T00:05:00Z",
      payload: { entropyDelta: 0.08 }
    }
  ]);
}
