import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function PosteriorPilotDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/sirrenasim/posterior")
      .then((res) => res.json())
      .then(setData)
      .catch(() => {});
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h2 className="text-2xl font-bold">🎛️ Posterior Pilot Dashboard</h2>

      {!data ? (
        <Loader2 className="animate-spin w-6 h-6" />
      ) : (
        <>
          {/* Inference Forecast Panel */}
          <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold mb-2">🔮 Inference Forecast</h3>
              <div className="grid grid-cols-2 gap-4">
                {data.forecasts.map((f, idx) => (
                  <div key={idx} className="p-2 border rounded-md">
                    <div className="text-sm text-muted-foreground">Zone: {f.zone}</div>
                    <div className="text-lg font-medium">{f.prediction}</div>
                    <Badge variant="outline">{(f.probability * 100).toFixed(1)}%</Badge>
                    <Badge variant="secondary">
                      Method: {f.method === "variational" ? "⚡ VI" : "🎯 Sampling"}
                    </Badge>
                    <div className="text-xs mt-1 text-muted-foreground">
                      🧠 EF Score: {f.meta.epistemic_friction_score} | IA Delta: {f.meta.isaad_alignment_delta} | Echo Index: {f.meta.recursive_echo_index}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Confidence Evolution Chart */}
          <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold mb-2">📈 Confidence Evolution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.confidenceTimeline}>
                  <XAxis dataKey="timestamp" tickFormatter={(t) => new Date(t).toLocaleTimeString()} />
                  <YAxis domain={[0, 1]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="confidence" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Belief Path Explorer */}
          <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold mb-2">🧭 Belief Path Explorer</h3>
              <ul className="space-y-2">
                {data.beliefPath.map((b, idx) => (
                  <li key={idx} className="p-2 border rounded-md">
                    <div className="font-medium">{b.event_type}</div>
                    <div className="text-sm text-muted-foreground">{new Date(b.timestamp).toLocaleString()}</div>
                    <div className="text-sm">Prior: {b.prior.toFixed(2)} → Posterior: {b.posterior.toFixed(2)}</div>
                    <Badge variant="outline">Cause: {b.meta.cause}</Badge>
                    <Badge variant="secondary">
                      Method: {b.meta.inference_method === "variational" ? "⚡ VI" : "🎯 Sampling"}
                    </Badge>
                    <div className="text-xs mt-1 text-muted-foreground">
                      🧠 EF Score: {b.meta.epistemic_friction_score} | IA Delta: {b.meta.isaad_alignment_delta} | Echo Index: {b.meta.recursive_echo_index}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </motion.div>
  );
}
