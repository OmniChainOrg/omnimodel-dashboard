// Simulates dynamic OmniversalisDAO™ activity events

export default function handler(req, res) {
  const zones = ["OmniversalisDAO™"];
  const validators = ["ProposalChain-Ω", "VoteLogic-7", "BudgetAI-02", "GovernNode-X", "CollectiveTrust-Alpha"];
  const types = [
    "Proposal submitted",
    "Budget allocated",
    "Vote registry updated"
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

