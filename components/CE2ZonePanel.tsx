import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function CE2ZonePanel() {
  const [zone, setZone] = useState("TradePharma");
  const [payload, setPayload] = useState("{}");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ce2/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zone, payload: JSON.parse(payload) }),
      });
      const json = await res.json();
      setResponse(json);
    } catch (error) {
      setResponse({ error: "Failed to process request." });
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6"
    >
      <h2 className="text-2xl font-bold">💠 CE² Zone Reflexive Panel</h2>

      <div className="space-y-2">
        <label className="font-medium">Zone Target:</label>
        <select
          className="border rounded px-2 py-1"
          value={zone}
          onChange={(e) => setZone(e.target.value)}
        >
          <option value="TradePharma">TradePharma</option>
          <option value="OBU">OBU</option>
          <option value="PharmaEthos">PharmaEthos</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="font-medium">Payload JSON:</label>
        <Textarea
          rows={8}
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
        />
      </div>

      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? <Loader2 className="animate-spin" /> : "🔁 Submit Reflexive Update"}
      </Button>

      {response && (
        <Card className="rounded-2xl shadow-lg mt-4">
          <CardContent className="p-4 space-y-2">
            <h3 className="text-lg font-semibold">Response</h3>
            {response.error ? (
              <p className="text-red-500">{response.error}</p>
            ) : (
              <pre className="whitespace-pre-wrap text-sm">
                {JSON.stringify(response, null, 2)}
              </pre>
            )}
            <div className="text-xs text-muted-foreground">
              Drift: {response.drift_metric} | Entropy: {response.fork_entropy}
            </div>
            {response?.simulation_snapshot && (
              <div className="text-sm italic">
                "{response.simulation_snapshot}" 🧠
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
