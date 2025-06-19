// pages/api/consensus/events.ts

function generateEntropyEvent(id, zone) {
  const entropyDelta = parseFloat((Math.random() * 0.2).toFixed(2));
  return {
    id,
    zone,
    action: "anchor_shift",
    timestamp: new Date(Date.now() - Math.random() * 100000).toISOString(),
    payload: { entropyDelta },
  };
}

export default function handler(req, res) {
  const events = [
    generateEntropyEvent(1, "OmniTwin"),
    generateEntropyEvent(2, "SirrenaSim"),
    generateEntropyEvent(3, "CE2"),
    generateEntropyEvent(4, "TradePharma"),
  ];

  res.status(200).json(events);
}

