
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import EntropyDriftChart from "@/components/EntropyDriftChart";
import { FaExclamationTriangle } from "react-icons/fa";
import { GiSplitCross } from "react-icons/gi";
import { motion } from "framer-motion";

const EpistemicEngine = () => {
  const [entropy, setEntropy] = useState(0.14);
  const [consensus, setConsensus] = useState({
    consensus_score: 0.92,
    justification_summary:
      "High coherence between L8 intuition and CE² anchors.",
    memory_alignment_passed: true,
    drift_meta: { entropy: 0.14, anchoring_ratio: 0.88 },
  });

  useEffect(() => {
    // Simulated real-time update
    const timer = setInterval(() => {
      setEntropy((prev) =>
        Math.max(0, Math.min(0.2, prev + (Math.random() - 0.5) * 0.01))
      );
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Card className="rounded-2xl shadow-lg border-pink-200 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-6"
        >
          <h2 className="font-bold text-xl mb-2">OmniTwin ∞ Consensus Relay</h2>
          <p className="text-sm">LIVE</p>
          <p className="text-sm mt-2">
            <strong>Consensus Score:</strong> {consensus.consensus_score}
          </p>
          <p className="text-sm">{consensus.justification_summary}</p>
          <p className="text-sm">Memory Aligned</p>
          <p className="text-sm mt-2">
            <strong>Entropy:</strong> {entropy.toFixed(2)} —{" "}
            <strong>Anchoring Ratio:</strong> {consensus.drift_meta.anchoring_ratio}
          </p>
          <p className="text-sm mb-2">
            Proceed with recursive consensus escalation.
          </p>

          <div className="mt-4">
            <h3 className="text-md font-semibold">Entropy Drift Monitor</h3>
            {entropy > 0.15 && (
              <div className="text-red-600 font-bold text-sm flex items-center">
                <FaExclamationTriangle className="mr-1" />
                Entropy Spike Detected: {entropy.toFixed(3)}
              </div>
            )}
            <div className="mt-2">
              <EntropyDriftChart />
            </div>
          </div>
        </motion.div>
      </Card>
    </>
  );
};

export default EpistemicEngine;
