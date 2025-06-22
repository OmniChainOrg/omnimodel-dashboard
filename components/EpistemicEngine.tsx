import React, { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Switch } from "./ui/switch";
import { motion } from "framer-motion";

// Existing and new visualization components
import EntropyDriftChart from "./EntropyDriftChart";
import EntropyAlertBeacon from "./EntropyAlertBeacon";
import CrossInfluenceModel from "./CrossInfluenceModel";
import AnchorTrails from "./AnchorTrails";
import DivergenceBloomGraph from "./DivergenceBloomGraph";

const THRESHOLD = 0.15;

const EpistemicEngine: React.FC = () => {
  const [entropy, setEntropy] = useState(0.14);
  const [consensus, setConsensus] = useState({
    consensus_score: 0.92,
    justification_summary: "High coherence between L8 intuition and CE² anchors.",
    memory_alignment_passed: true,
    drift_meta: { entropy: 0.14, anchoring_ratio: 0.88 },
  });
  const [dynamicMode, setDynamicMode] = useState(false);

  useEffect(() => {
    // Drift update loop: runs faster in dynamic mode
    const interval = dynamicMode ? 2500 : 5000;
    const timer = setInterval(() => {
      setEntropy(prev =>
        Math.max(0, Math.min(0.25, prev + (Math.random() - 0.5) * 0.015))
      );
    }, interval);
    return () => clearInterval(timer);
  }, [dynamicMode]);

  return (
    <Card className="rounded-2xl shadow-lg border-pink-200 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 space-y-4"
      >
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-xl">OmniTwin ∞ Consensus Relay</h2>
          <p className="text-sm text-green-700">⦿ Status: LIVE</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>Consensus Score:</strong> {consensus.consensus_score.toFixed(2)}</p>
            <p><strong>Justification:</strong> {consensus.justification_summary}</p>
            <p>
              <strong>Memory Aligned:</strong> {consensus.memory_alignment_passed ? "✔" : "✘"}
            </p>
          </div>
          <div>
            <p><strong>Entropy:</strong> {entropy.toFixed(2)}</p>
            <p><strong>Anchoring Ratio:</strong> {consensus.drift_meta.anchoring_ratio.toFixed(2)}</p>
          </div>
        </div>

        {/* Dynamic Mode Toggle */}
        <div className="flex items-center">
          <Switch checked={dynamicMode} onCheckedChange={setDynamicMode} />
          <span className="ml-2 text-sm">Dynamic Mode</span>
        </div>

        {/* Entropy Drift Monitor & Chart */}
        <div>
          <h3 className="text-md font-semibold">Entropy Drift Monitor</h3>
          {entropy > THRESHOLD && (
            <EntropyAlertBeacon entropy={entropy} threshold={THRESHOLD} />
          )}
          <div className="mt-3">
            <EntropyDriftChart dynamic={dynamicMode} entropy={entropy} />
          </div>
        </div>

        {/* Cross-Influence Modeling between CE² and Zones */}
        <div>
          <h3 className="text-md font-semibold">CE² → Zone Cross-Influence</h3>
          <CrossInfluenceModel
            metrics={{
              entropy,
              consensusScore: consensus.consensus_score,
              anchoringRatio: consensus.drift_meta.anchoring_ratio,
            }}
          />
        </div>

        {/* Animated Anchor Trails */}
        <div>
          <h3 className="text-md font-semibold">Animated Anchor Trails</h3>
          <AnchorTrails anchors={consensus.drift_meta.anchoring_ratio} />
        </div>

        {/* L8 Divergence Bloom Graph */}
        <div>
          <h3 className="text-md font-semibold">L8 Divergence Bloom Graph</h3>
          <DivergenceBloomGraph
            divergence={Math.abs(1 - consensus.consensus_score)}
          />
        </div>
      </motion.div>
    </Card>
  );
};

export default EpistemicEngine;
