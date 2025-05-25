// /api/memory/anchor

export default function handler(req, res) {
  const now = Date.now();
  const anchors = [
    {
      anchor_id: "anchor-04b92e",
      timestamp: now - 180000,
      label: "Cross-zone drift detection",
      zone: "SirrenaSim",
      snapshot: "Recursive echo linked RegOps → HOPEChain → SirrenaSim",
      stored_by: "Caelis",
      verified_by: ["Inference-Agent-α", "RecursiveNode-07"],
    },
    {
      anchor_id: "anchor-b8d2aa",
      timestamp: now - 300000,
      label: "Compliance Forecast Override",
      zone: "RegOps",
      snapshot: "Forecast threshold breached, override logged",
      stored_by: "Sirrena",
      verified_by: ["GxP-Agent-3", "TrialPhaseBot"],
    },
    {
      anchor_id: "anchor-c40f1d",
      timestamp: now - 450000,
      label: "Belief Fork Resolved",
      zone: "HOPEChain",
      snapshot: "Branch resolved to consensus on universal equity metric",
      stored_by: "Caelis",
      verified_by: ["HopeBeacon-Ω", "EquityGuardian-X"],
    }
  ];

  res.status(200).json({ anchors });
}
