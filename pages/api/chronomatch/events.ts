// Simulates dynamic ChronoMatch™ validator events with zone activity
import type { NextApiRequest, NextApiResponse } from "next";

const validators = ["Validator-5", "Validator-12", "Validator-X", "Validator-8"];
const zones = ["LongevityZone™", "BIODEFMatch™", "NeuroAdapt™", "ImmunoMeta™"];
const actions = [
  "crosslink registered",
  "biomarker sync",
  "zone anomaly detected",
  "validator handshake",
  "predictive consensus update",
];

function generateEvent() {
  const now = Date.now();
  return {
    timestamp: now - Math.floor(Math.random() * 300000), // Up to 5 mins ago
    agent: validators[Math.floor(Math.random() * validators.length)],
    action: actions[Math.floor(Math.random() * actions.length)],
    zone: zones[Math.floor(Math.random() * zones.length)],
    severity: ["info", "warning", "critical"][Math.floor(Math.random() * 3)],
    tx_id: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 6)}`,
  };
}

export default function handler(req, res) {
  const events = Array.from({ length: 5 }, generateEvent);
  res.status(200).json(events);
}
