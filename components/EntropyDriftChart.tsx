import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import EntropyDriftChart from "@/components/EntropyDriftChart";

// Dynamic Entropy Drift Chart using Chart.js and react-chartjs-2
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip);

const EntropyDriftChart: React.FC<{ dynamic: boolean; entropy: number }> = ({ dynamic, entropy }) => {
  const [dataPoints, setDataPoints] = useState<number[]>([entropy, entropy, entropy, entropy, entropy]);
  useEffect(() => {
    if (dynamic) {
      setDataPoints(prev => [...prev.slice(-4), entropy]);
    }
  }, [entropy, dynamic]);

  const labels = dataPoints.map((_, idx) =>
    idx < dataPoints.length - 1 ? `T-${dataPoints.length - idx - 1}` : "Now"
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Entropy Drift",
        data: dataPoints,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    animation: { duration: dynamic ? 500 : 0 },
    responsive: true,
    scales: {
      x: { title: { display: true, text: "Time" } },
      y: { title: { display: true, text: "Entropy" }, min: 0, max: 0.25 },
    },
  };

  return <Line data={data} options={options} />;
};

// Local Switch component
interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}
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
  // Dynamic mode enabled by default for animated chart
  const [dynamicMode, setDynamicMode] = useState(true);
  const [entropy, setEntropy] = useState(0.14);
  const [consensus] = useState({
    consensus_score: 0.92,
    justification_summary: "High coherence between L8 intuition and CE² anchors.",
    memory_alignment_passed: true,
    drift_meta: { entropy: 0.14, anchoring_ratio: 0.88 },
  });

  // Update entropy drift over time
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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-xl">OmniTwin ∞ Consensus Relay</h2>
          <p className="text-sm text-green-700">⦿ Status: LIVE</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>Consensus Score:</strong> {consensus.consensus_score.toFixed(2)}</p>
            <p><strong>Justification:</strong> {consensus.justification_summary}</p>
            <p><strong>Memory Aligned:</strong> {consensus.memory_alignment_passed ? "✔" : "✘"}</p>
          </div>
          <div>
            <p><strong>Anchoring Ratio:</strong> {consensus.drift_meta.anchoring_ratio.toFixed(2)}</p>
          </div>
        </div>

        {/* Dynamic Mode Toggle */}
        <div className="flex items-center space-x-2">
          <Switch checked={dynamicMode} onCheckedChange={setDynamicMode} />
          <span className="text-sm">Dynamic Mode</span>
        </div>

        {/* Entropy Drift Monitor */}
        <div>
          <h3 className="text-md font-semibold">Entropy Drift Monitor</h3>
          {entropy > THRESHOLD && <EntropyAlertBeacon entropy={entropy} threshold={THRESHOLD} />}
          <div className="mt-3">
            <EntropyDriftChart dynamic={dynamicMode} entropy={entropy} />
          </div>
        </div>

        {/* CE² → Zone Cross-Influence */}
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
          <DivergenceBloomGraph divergence={Math.abs(1 - consensus.consensus_score)} />
        </div>
      </motion.div>
    </Card>
  );
};

export default EpistemicEngine;
