// Simulates dynamic HOPEChain™ activity events

export default function handler(req, res) {
  const zones = ["HOPEChain™"];
  const validators = ["ImpactNode-1", "RedeemStream-8", "UBI-Oracle-03", "EquityGuardian-X", "HopeBeacon-Ω"];
  const types = [
    "QR redeem logged",
    "UBI stream activated",
    "Impact score recalculated"
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
