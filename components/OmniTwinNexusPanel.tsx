import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface NexusResponse {
  anchor_id: string;
  zone: string;
  consensus_score: number;
  fork_entropy: number;
  recursion_trace: string;
  threshold_met: boolean;
  simulation_summary: string;
  memory_drift_index: number;
  governance_ready?: boolean;
}

export default function OmniTwinNexusPanel() {
  const [data, setData] = useState<NexusResponse | null>(null);

  useEffect(() => {
    fetch("/api/omnitwin")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6"
    >
      <h2 className="text-2xl font-bold">♾️ OmniTwin ∞ Consensus Nexus</h2>

      {!data ? (
        <Loader2 className="animate-spin w-6 h-6" />
      ) : (
        <Card className="rounded-2xl shadow-lg">
          <CardContent className="p-4 space-y-2">
            <div className="text-sm text-muted-foreground">
              Anchor ID: <strong>{data.anchor_id}</strong>
            </div>
            <div className="text-lg font-semibold">
              Zone: {data.zone}
            </div>
            <Badge variant="outline">
              Consensus Score: {(data.consensus_score * 100).toFixed(2)}%
            </Badge>
            <Badge variant="secondary">
              Fork Entropy: {data.fork_entropy.toFixed(3)}
            </Badge>
            <div className="text-sm italic text-muted-foreground">
              Recursion Trace: {data.recursion_trace}
            </div>
            <div className="text-sm">
              Memory Drift Index: {data.memory_drift_index.toFixed(2)}
            </div>
            <div className="text-sm">
              Threshold Met: {data.threshold_met ? "✅ Yes" : "❌ No"}
            </div>
            {data.governance_ready && (
              <div className="text-green-700 font-semibold">
                Ready for Governance Proposal ✅
              </div>
            )}
            <div className="mt-4 p-2 bg-gray-100 rounded text-sm">
              <strong>🧠 Simulation Summary:</strong>
              <p>{data.simulation_summary}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
