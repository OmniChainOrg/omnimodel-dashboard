// components/CE2ConsensusProtocol.tsx

import React from "react";

/**
 * This component manages the epistemic consensus flow from CE²Zone
 * through SirrenaSim and OmniTwin, ultimately proposing $HOPE actions
 * for governance validation.
 */

export interface CE2InputPayload {
  user_did: string;
  zone: string;
  meta_zone: "CE2Zone" | "SirrenaSim" | "HOPEChain" | "TradePharma" | "OmniTwin";
  fork_entropy: number;
  memory_anchor_strength: number;
  belief_drift_delta: number;
  aid_eligibility_inferred: boolean;
  simulation_trace_id: string;
  posterior_score: number;
  timestamp: string;
}

export interface CE2OutputConsensus {
  consensus_trace_id: string;
  proposed_action: string;
  governance_required: boolean;
  omni_twin_context: {
    user_did: string;
    trust_score: number;
    zone_history: string[];
  };
  posterior_score: number;
  justification: string;
  ready_for_snapshot: boolean;
  l5_anchor_id: string;
  fork_origin_meta: {
    entropy: number;
    drift_delta: number;
    anchor_strength: number;
  };
}

export function processCE2Consensus(input: CE2InputPayload): CE2OutputConsensus {
  const consensus_trace_id = `consensus_${input.simulation_trace_id}`;

  const governance_required = input.posterior_score >= 0.75 && input.aid_eligibility_inferred;
  const justification = governance_required
    ? `Posterior score (${input.posterior_score}) with strong belief drift (${input.belief_drift_delta}) suggests immediate consensus.`
    : `Insufficient posterior or drift data for automated aid.`;

  return {
    consensus_trace_id,
    proposed_action: governance_required ? "$HOPE Aid Proposal" : "Trace Only",
    governance_required,
    omni_twin_context: {
      user_did: input.user_did,
      trust_score: Math.min(1, input.memory_anchor_strength + input.posterior_score / 2),
      zone_history: [input.zone, input.meta_zone],
    },
    posterior_score: input.posterior_score,
    justification,
    ready_for_snapshot: governance_required,
    l5_anchor_id: `anchor_${input.simulation_trace_id}`,
    fork_origin_meta: {
      entropy: input.fork_entropy,
      drift_delta: input.belief_drift_delta,
      anchor_strength: input.memory_anchor_strength,
    },
  };
}

export default function CE2ConsensusProtocolDemo() {
  const exampleInput: CE2InputPayload = {
    user_did: "did:omnichain:0xAlpha",
    zone: "TradePharma",
    meta_zone: "CE2Zone",
    fork_entropy: 0.81,
    memory_anchor_strength: 0.62,
    belief_drift_delta: 0.24,
    aid_eligibility_inferred: true,
    simulation_trace_id: "sim_hope001",
    posterior_score: 0.79,
    timestamp: new Date().toISOString(),
  };

  const output = processCE2Consensus(exampleInput);

  return (
    <div className="p-4 rounded-xl shadow-lg bg-white">
      <h2 className="text-xl font-semibold mb-2">🔁 CE² Consensus Protocol Result</h2>
      <pre className="bg-gray-100 p-2 rounded text-sm">
        {JSON.stringify(output, null, 2)}
      </pre>
    </div>
  );
}
