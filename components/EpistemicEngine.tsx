import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Network } from "lucide-react";
import { motion } from "framer-motion";
import EntropyDriftChart from "@/components/EntropyDriftChart";
import L8BloomGraph from "@/components/L8BloomGraph";

interface ConsensusData {
  consensus_score: number;
  justification_summary: string;
  memory_alignment_passed: boolean;
  drift_meta: {
    fork_entropy: number;
    anchoring_ratio: number;
  };
  action_recommendation: string;
}

export default function RecursiveEpistemicEngine() {
  const [consensus, setConsensus] = useState<ConsensusData | null>(null);
  const [loading, setLoading] = useState(false);
  
  const fetchConsensus = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/consensus/omnitwin", {
        method: "POST",
      });
      const data = await res.json();
      setConsensus(data);
    } catch (err) {
      console.error("Consensus error:", err);
    } finally {
      setLoading(false);
    }
  };

  const divergences = [
  { zone: "SirrenaSim", divergenceLevel: 0.76 },
  { zone: "HOPEChain", divergenceLevel: 0.43 },
  { zone: "TradePharma", divergenceLevel: 0.61 },
];
  useEffect(() => {
    fetchConsensus();
  }, []);

  return (
    <>
      <Card className="rounded-2xl shadow-lg border-pink-200 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CardContent className="p-4 relative z-10">
            <div className="flex items-center space-x-2 mb-2">
              <Network className="text-pink-500" />
              <h3 className="text-xl font-semibold">OmniTwin ∞ Consensus Relay</h3>
              <span className="ml-2 px-2 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full animate-pulse">
                LIVE
              </span>
            </div>

            {consensus ? (
              <motion.div
                key={consensus.consensus_score}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-1"
              >
                <p className="text-sm text-muted-foreground">
                  <strong>Consensus Score:</strong>{" "}
                  <span className="font-semibold text-blue-600">
                    {consensus.consensus_score.toFixed(2)}
                  </span>
                </p>
                <p className="text-sm">{consensus.justification_summary}</p>
                <Badge variant={consensus.memory_alignment_passed ? "default" : "destructive"}>
                  {consensus.memory_alignment_passed ? "Memory Aligned" : "Needs More Anchoring"}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  <strong>Entropy:</strong>{" "}
                  <span className="text-amber-600">
                    {consensus.drift_meta.fork_entropy.toFixed(2)}
                  </span>{" "}— <strong>Anchoring Ratio:</strong>{" "}
                  <span className="text-emerald-600">
                    {consensus.drift_meta.anchoring_ratio.toFixed(2)}
                  </span>
                </p>
                <p className="font-semibold text-purple-700 text-sm">
                  {consensus.action_recommendation}
                </p>
              </motion.div>
            ) : (
              <p className="text-sm text-muted-foreground">Loading consensus evaluation…</p>
            )}
          </CardContent>
        </motion.div>

        {/* Background Bloom */}
        <div className="absolute inset-0 z-0 animate-pulse bg-gradient-to-br from-pink-100 to-transparent opacity-10" />
      </Card>
    <>
      <EntropyDriftChart />
      <L8BloomGraph divergences={divergences} />
    </>
  );
}
