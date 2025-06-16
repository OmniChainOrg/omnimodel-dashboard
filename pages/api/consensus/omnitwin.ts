// /pages/api/consensus/omnitwin.ts

import type { NextApiRequest, NextApiResponse } from "next";

interface OmniConsensusInput {
  did: string;
  zones: string[];
  simulation_trace_ids: string[];
  memory_anchors: string[];
  friction_score_avg: number;
  alignment_delta_avg: number;
  recursive_drift_index: number;
}

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

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<OmniConsensusResult | { error: string }>
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Only POST method is allowed." });
    return;
  }

  const {
    did,
    zones,
    simulation_trace_ids,
    memory_anchors,
    friction_score_avg,
    alignment_delta_avg,
    recursive_drift_index,
  } = req.body as OmniConsensusInput;

  // Basic decision logic v0.1
  const fork_entropy = Math.log(zones.length * (recursive_drift_index + 1));
  const anchoring_ratio = memory_anchors.length / simulation_trace_ids.length;

  const consensus_score =
    (alignment_delta_avg + anchoring_ratio - friction_score_avg) /
    (1 + fork_entropy);

  const memory_alignment_passed = anchoring_ratio > 0.5 && friction_score_avg < 0.3;

  const justification_summary = `Evaluated across ${zones.length} zones with fork entropy ${fork_entropy.toFixed(
    2
  )}, anchoring ratio ${anchoring_ratio.toFixed(2)}, and avg. alignment ${alignment_delta_avg.toFixed(
    2
  )}`;

  const action_recommendation = consensus_score > 0.4 ?
    "✅ Issue $HOPE approval & log into OmniTwin" :
    "🟡 Defer — More anchoring or simulation evidence required";

  res.status(200).json({
    consensus_score: Number(consensus_score.toFixed(3)),
    justification_summary,
    memory_alignment_passed,
    drift_meta: {
      fork_entropy: Number(fork_entropy.toFixed(2)),
      anchoring_ratio: Number(anchoring_ratio.toFixed(2)),
    },
    action_recommendation,
  });
}
