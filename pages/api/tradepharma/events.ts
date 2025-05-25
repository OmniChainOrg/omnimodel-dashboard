// Simulates dynamic TradePharma™ activity events

export default function handler(req, res) {
  const zones = ["TradePharma™"];
  const validators = ["ColdChainGuard-X", "DrugRedeem-Bot-7", "SupplySync-12", "PharmaTrace-88", "VendorNode-5"];
  const types = [
    "Drug redeemed",
    "Cold chain anomaly detected",
    "Supplier verified"
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
