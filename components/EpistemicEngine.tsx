import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

// Inline placeholder components to avoid missing modules
const EntropyDriftChart: React.FC<{ dynamic: boolean; entropy: number }> = ({ dynamic, entropy }) => (
  <div className="h-32 bg-white/20 flex items-center justify-center rounded">
    Entropy Drift Chart: {entropy.toFixed(2)} (Mode: {dynamic ? "Dynamic" : "Static"})
  </div>
);

const EntropyAlertBeacon: React.FC<{ entropy: number; threshold: number }> = ({ entropy, threshold }) => (
  <div className="text-red-600 font-bold">
    🔺 Entropy Alert: {entropy.toFixed(2)} > {threshold}
  </div>
);

const CrossInfluenceModel: React.FC<{ metrics: { entropy: number; consensusScore: number; anchoringRatio: number } }> = ({ metrics }) => (
  <div className="h-32 bg-white/20 flex flex-col items-center justify-center rounded">
    <p>Cross-Influence Model</p>
    <p>Entropy: {metrics.entropy.toFixed(2)}</p>
    <p>Consensus: {metrics.consensusScore.toFixed(2)}</p>
    <p>Anchoring: {metrics.anchoringRatio.toFixed(2)}</p>
  </div>
);

const AnchorTrails: React.FC<{ anchors: number }> = ({ anchors }) => (
  <div className="h-32 bg-white/20 flex items-center justify-center rounded">
    Animated Anchor Trails: Ratio {anchors.toFixed(2)}
  </div>
);

const DivergenceBloomGraph: React.FC<{ divergence: number }> = ({ divergence }) => (
  <div className="h-32 bg-white/20 flex items-center justify-center rounded">
    L8 Divergence Bloom: {divergence.toFixed(2)}
  </div>
);

// Local Switch implementation
type SwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

const Switch: React.FC<SwitchProps> = ({ checked, onCheckedChange }) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={() => onCheckedChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
      checked ? "bg-blue-600" : "bg-gray-300"
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
        checked ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

const THRESHOLD = 0.15;

const EpistemicEngine: React.FC = () => {
  const [entropy, setEntropy] = useState(0.14);
  const [consensus] = useState({
    consensus_score: 0.92,
    justification_summary: "High coherence between L8 intuition and CE² anchors.",
    memory_alignment_passed: true,
    drift_meta: { entropy: 0.14, anchoring_ratio: 0.88 },
  });
  const [dynamicMode, setDynamicMode] = useState(false);

  useEffect(() => {
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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-xl">OmniTwin ∞ Consensus Relay</h2>
          <p className="text-sm text-green-700">⦿ Status: LIVE</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>Consensus Score:</strong> {consensus.consensus_score.toFixed(2)}</p>
            <p><strong>Justification:</strong> {consensus.justification_summary}</p>
            <p><strong>Memory Aligned:</strong> {consensus.memory_alignment_passed ? "✔" : "✘"}</p>
          </div>
          <div>
            <p><strong>Entropy:</strong> {entropy.toFixed(2)}</p>
            <p><strong>Anchoring Ratio:</strong> {consensus.drift_meta.anchoring_ratio.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex items-center">
          <Switch checked={dynamicMode} onCheckedChange={setDynamicMode} />
          <span className="ml-2 text-sm">Dynamic Mode</span>
        </div>

        <div>
          <h3 className="text-md font-semibold">Entropy Drift Monitor</h3>
          {entropy > THRESHOLD && <EntropyAlertBeacon entropy={entropy} threshold={THRESHOLD} />}
          <div className="mt-3">
            <EntropyDriftChart dynamic={dynamicMode} entropy={entropy} />
          </div>
        </div>

        <div>
          <h3 className="text-md font-semibold">CE² → Zone Cross-Influence</h3>
          <CrossInfluenceModel metrics={{ entropy, consensusScore: consensus.consensus_score, anchoringRatio: consensus.drift_meta.anchoring_ratio }} />
        </div>

        <div>
          <h3 className="text-md font-semibold">Animated Anchor Trails</h3>
          <AnchorTrails anchors={consensus.drift_meta.anchoring_ratio} />
        </div>

        <div>
          <h3 className="text-md font-semibold">L8 Divergence Bloom Graph</h3>
          <DivergenceBloomGraph divergence={Math.abs(1 - consensus.consensus_score)} />
        </div>
      </motion.div>
    </Card>
  );
};

export default EpistemicEngine;
