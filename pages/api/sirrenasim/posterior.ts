export default function handler(req, res) {
  const zones = ["NEUROEdge", "BioSynthesis", "RegOps", "HOPEChain", "ImmunoAtlas"];
  const forecasts = zones.map((zone) => ({
    zone,
    prediction: ["Spike", "Moderate Activity", "High Sync"][Math.floor(Math.random() * 3)],
    probability: Math.random(),
  }));

  const confidenceTimeline = Array.from({ length: 12 }).map((_, i) => ({
    timestamp: Date.now() - i * 60000,
    confidence: Math.random(),
  }));

  const beliefPath = Array.from({ length: 6 }).map((_, i) => ({
    timestamp: Date.now() - i * 30000,
    event_type: ["Threshold Breach", "Meta-Validation", "Temporal Sync"][i % 3],
    prior: Math.random(),
    posterior: Math.random(),
    meta: { cause: "simulated_trigger" },
  }));

  res.status(200).json({
    forecasts,
    confidenceTimeline,
    beliefPath,
  });
}
