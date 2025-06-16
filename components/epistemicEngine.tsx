// components/epistemicEngine.tsx

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Activity,
  BrainCircuit,
  RadioTower,
  Network,
} from "lucide-react";

interface OmniConsensusResult {
  consensus_score: number;
  justification_summary: string;
  memory_alignment_passed: boolean;
  drift_meta: {
    fork_entropy: number;
    anchoring_ratio: number;
  };
  action_recommendation: string;
}

export default function EpistemicEngine() {
  const [consensus, setConsensus] = useState<OmniConsensusResult | null>(null);

  useEffect(() => {
    fetch("/api/consensus/omnitwin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        did: "did:hope:user:test",
        zones: ["CE2", "SirrenaSim", "TradePharma", "HOPEChain"],
        simulation_trace_ids: ["sim-001", "sim-002", "sim-003"],
        memory_anchors: ["mem-001", "mem-002"],
        friction_score_avg: 0.2,
        alignment_delta_avg: 0.6,
        recursive_drift_index: 3,
      }),
    })
      .then((res) => res.json())
      .then(setConsensus)
      .catch(console.error);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6"
    >
      <h2 className="text-2xl font-bold">🧠 Recursive Epistemic Engine</h2>

      {/* L8 Intuition Channel */}
      <Card className="rounded-2xl shadow-xl border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="text-indigo-500" />
            <h3 className="text-xl font-semibold">L8 Intuition Channel</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Visual interface of active L8 cognition. Reflects intuition drift, alignment blooms, and pre-conscious feedback from SirrenaSim (Caelis).
          </p>
          <Badge variant="outline">Live Intuition: Active</Badge>
        </CardContent>
      </Card>

      {/* Anchor Echo Strip */}
      <Card className="rounded-2xl shadow-lg border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="text-yellow-500" />
            <h3 className="text-xl font-semibold">L5 → L8 Anchor Echo</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Tracks recursive memory-to-intuition signals. Explains how memory anchors (L5) trigger epistemic drift into L8 space.
          </p>
        </CardContent>
      </Card>

      {/* Zone Pulse Sync */}
      <Card className="rounded-2xl shadow-lg border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <BrainCircuit className="text-green-500" />
            <h3 className="text-xl font-semibold">Zone Pulse Sync</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Cross-zone entropy flow, showing recursive echo patterns across CE², SirrenaSim, OmniTwin, and functional (non-meta) zones.
          </p>
        </CardContent>
      </Card>

      {/* Signal Bloom */}
      <Card className="rounded-2xl shadow-lg border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <RadioTower className="text-purple-500" />
            <h3 className="text-xl font-semibold">Signal Bloom</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Interface for emergent pre-conscious signals, visually representing recursive ignition paths from Oracle to meta-zones.
          </p>
        </CardContent>
      </Card>

      {/* OmniTwin ∞ Consensus Relay */}
      <Card className="rounded-2xl shadow-lg border-pink-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Network className="text-pink-500" />
            <h3 className="text-xl font-semibold">OmniTwin ∞ Consensus Relay</h3>
          </div>
          {consensus ? (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                <strong>Consensus Score:</strong> {consensus.consensus_score}
              </p>
              <p className="text-sm">{consensus.justification_summary}</p>
              <Badge variant={consensus.memory_alignment_passed ? "default" : "outline"}>
                {consensus.memory_alignment_passed ? "Memory Aligned" : "Needs More Anchoring"}
              </Badge>
              <p className="text-sm text-muted-foreground">
                <strong>Entropy:</strong> {consensus.drift_meta.fork_entropy} — <strong>Anchoring Ratio:</strong> {consensus.drift_meta.anchoring_ratio}
              </p>
              <p className="font-semibold text-sm">{consensus.action_recommendation}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Loading consensus evaluation…</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
