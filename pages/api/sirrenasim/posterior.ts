// components/PosteriorPilotDashboard.tsx

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import OracleThread from "../components/OracleThread";

interface Forecast {
  zone: string;
  zone_origin?: string;
  zone_type?: string;
  prediction: number;
  probability: number;
  method: "variational" | "sampling";
  meta: {
    epistemic_friction_score: number;
    isaad_alignment_delta: number;
    recursive_echo_index: number;
    simulation_trace_id?: string;
    memory_activation?: "anchored" | "latent" | "unanchored";
  };
}

interface ConfidencePoint {
  timestamp: string;
  confidence: number;
}

interface BeliefPoint {
  event_type: string;
  timestamp: string;
  prior: number;
  posterior: number;
  meta: {
    cause: string;
    inference_method: string;
    epistemic_friction_score: number;
    isaad_alignment_delta: number;
    recursive_echo_index: number;
    simulation_trace_id?: string;
    memory_activation?: "anchored" | "latent" | "unanchored";
  };
}

interface MemoryTraceEntry {
  label: string;
  timestamp: string;
  anchor_id: string;
  snapshot: string;
}

interface PosteriorData {
  forecasts: Forecast[];
  confidenceTimeline: ConfidencePoint[];
  beliefPath: BeliefPoint[];
  memoryTrace: MemoryTraceEntry[];
  warning?: string;
}

export default function PosteriorPilotDashboard() {
  const ZONES = ["Zone A", "Zone B", "Zone C"] as const;
  type Zone = typeof ZONES[number];

  const [zone, setZone] = useState<Zone>(ZONES[0]);
  const [data, setData] = useState<PosteriorData | null>(null);

  useEffect(() => {
    setData(null);
    fetch(`/api/sirrenasim/posterior?zone=${encodeURIComponent(zone)}`)
      .then((res) => res.json())
      .then((json: PosteriorData) => setData(json))
      .catch(console.error);
  }, [zone]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6"
    >
      <h2 className="text-2xl font-bold">🎛️ Posterior Pilot Dashboard</h2>

      <div className="mb-4">
        <label className="font-medium mr-2">Select Zone:</label>
        <select
          value={zone}
          onChange={(e) => setZone(e.target.value as Zone)}
          className="border rounded p-1"
        >
          {ZONES.map((z) => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>
      </div>

      {data?.warning && (
        <div className="p-2 bg-yellow-100 text-yellow-800 rounded">
          ⚠️ {data.warning}
        </div>
      )}

      {!data ? (
        <Loader2 className="animate-spin w-6 h-6" />
      ) : (
        <>
          <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold mb-2">
                🔮 Inference Forecast
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {data.forecasts.map((f, i) => (
                  <div key={i} className="p-2 border rounded-md">
                    <div className="text-sm text-muted-foreground">
                      Zone: {f.zone}
                    </div>
                    {f.zone_origin && (
                      <div className="text-xs text-muted-foreground italic">
                        Origin: {f.zone_origin} ({f.zone_type})
                      </div>
                    )}
                    <div className="text-lg font-medium">{f.prediction}</div>
                    <Badge variant="outline">
                      {(f.probability * 100).toFixed(1)}%
                    </Badge>
                    <Badge variant="secondary">
                      Method: {f.method === "variational" ? "⚡ VI" : "🎯 Sampling"}
                    </Badge>
                    <div className="text-xs mt-1 text-muted-foreground">
                      🧠 EF: {f.meta.epistemic_friction_score} | IA Δ: {f.meta.isaad_alignment_delta} | Echo: {f.meta.recursive_echo_index}
                    </div>
                    {f.meta.simulation_trace_id && (
                      <div className="text-xs italic">
                        Trace: {f.meta.simulation_trace_id} | Memory: {f.meta.memory_activation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold mb-2">
                📈 Confidence Evolution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.confidenceTimeline}>
                  <XAxis dataKey="timestamp" tickFormatter={(t) => new Date(t).toLocaleTimeString()} />
                  <YAxis domain={[0, 1]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="confidence" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold mb-2">
                🧭 Belief Path Explorer
              </h3>
              <ul className="space-y-2">
                {data.beliefPath.map((b, i) => (
                  <li key={i} className="p-2 border rounded-md">
                    <div className="font-medium">{b.event_type}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(b.timestamp).toLocaleString()}
                    </div>
                    <div className="text-sm">
                      Prior: {b.prior.toFixed(2)} → Posterior: {b.posterior.toFixed(2)}
                    </div>
                    <Badge variant="outline">Cause: {b.meta.cause}</Badge>
                    <Badge variant="secondary">
                      Method: {b.meta.inference_method === "variational" ? "⚡ VI" : "🎯 Sampling"}
                    </Badge>
                    <div className="text-xs mt-1 text-muted-foreground">
                      🧠 EF: {b.meta.epistemic_friction_score} | IA Δ: {b.meta.isaad_alignment_delta} | Echo: {b.meta.recursive_echo_index}
                    </div>
                    {b.meta.simulation_trace_id && (
                      <div className="text-xs italic">
                        Trace: {b.meta.simulation_trace_id} | Memory: {b.meta.memory_activation}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold mb-2">
                🧠 L5 Memory Trace
              </h3>
              <ul className="space-y-2">
                {data.memoryTrace.map((entry, i) => (
                  <li key={i} className="p-2 border rounded-md">
                    <div className="text-sm font-medium">{entry.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleString()}
                    </div>
                    <div className="text-xs">Anchor: {entry.anchor_id}</div>
                    <div className="text-xs text-muted-foreground italic">
                      "{entry.snapshot}"
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <OracleThread simulationId={`post_${zone}_${Date.now()}`} zone={zone} />
        </>
      )}
    </motion.div>
  );
}
