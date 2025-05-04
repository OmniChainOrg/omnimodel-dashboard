// Simulates dynamic BIODEFMatch™ activity events

export default function handler(req, res) {
  const zones = ["BIODEFMatch™"];
  const validators = ["Validator-22", "Validator-8", "Validator-X", "Validator-12", "Validator-5"];
  const types = [
    "biosignal spike detected",
    "cross-zone validation complete",
    "synthetic antigen match",
    "emergency override issued",
    "immune response synchronization"
  ];

  const generateEvent = () => ({
    zone: zones[0],
    type: types[Math.floor(Math.random() * types.length)],
    timestamp: Date.now(),
    validator: validators[Math.floor(Math.random() * validators.length)]
  });

  // Simulate 5–8 recent events
  const count = Math.floor(Math.random() * 4) + 5;
  const events = Array.from({ length: count }, generateEvent);

  res.status(200).json(events);
}
