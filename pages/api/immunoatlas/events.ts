// Simulates dynamic ImmunoAtlas™ activity events

export default function handler(req, res) {
  const zones = ["ImmunoAtlas™"];
  const validators = ["TCR-Sentinel-7", "ImmunePattern-AI", "SignatureMapper-X", "TrialEntryBot-23", "ResponseMonitor-Δ"];
  const types = [
    "TCR sequencing completed",
    "Immune signature mapped",
    "Trial participant enrolled"
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
