import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ChainExplorerDashboard() {
  const [simulationLog, setSimulationLog] = useState(null);
  const [validators, setValidators] = useState([]);
  const [model, setModel] = useState(null);

  useEffect(() => {
    // Fetch latest simulation trace
    fetch('/api/simulation_trace/latest')
      .then(res => res.json())
      .then(data => setSimulationLog(data))
      .catch(() => {});
    // Fetch current validators
    fetch('/api/validators')
      .then(res => res.json())
      .then(data => setValidators(data))
      .catch(() => {});
    // Fetch latest model provenance
    fetch('/api/model_provenance/latest')
      .then(res => res.json())
      .then(data => setModel(data))
      .catch(() => {});
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
      {/* Simulation Trace Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-1"
      >
        <Card className="rounded-2xl shadow-xl">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">🧬 Simulation Trace</h2>
            {!simulationLog ? (
              <Loader2 className="animate-spin w-6 h-6" />
            ) : (
              <div className="space-y-1">
                <p><strong>Molecule:</strong> {simulationLog.molecule}</p>
                <p><strong>Hash:</strong> {simulationLog.hash}</p>
                <p><strong>Timestamp:</strong> {new Date(simulationLog.timestamp).toLocaleString()}</p>
                <p><strong>Verified by:</strong> <Badge variant="outline">{simulationLog.verified_by}</Badge></p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Validator Overview Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-1"
      >
        <Card className="rounded-2xl shadow-xl">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">🔐 Validator Network</h2>
            {!validators.length ? (
              <Loader2 className="animate-spin w-6 h-6" />
            ) : (
              validators.map((v, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{v.moniker}</p>
                    <p className="text-sm text-muted-foreground">Last heartbeat: {v.last_heartbeat}</p>
                  </div>
                  {v.status === 'active' ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <Badge variant="destructive">{v.status}</Badge>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Model Provenance Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-1"
      >
        <Card className="rounded-2xl shadow-xl">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">🔎 Model Provenance</h2>
            {!model ? (
              <Loader2 className="animate-spin w-6 h-6" />
            ) : (
              <div className="space-y-1">
                <p><strong>Model ID:</strong> {model.model_id}</p>
                <p><strong>Version:</strong> {model.version}</p>
                <p><strong>Checksum:</strong> {model.checksum}</p>
                <p><strong>Uploaded:</strong> {new Date(model.uploaded).toLocaleString()}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {model.tags.map((tag, i) => <Badge key={i}>{tag}</Badge>)}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Subnet Explorer Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-3 mt-4"
      >
        <Card className="rounded-2xl shadow-xl">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">🌐 Subnet Zone Explorer</h2>
            <p className="text-sm text-muted-foreground">Cross-zone activity coming soon. Monitor ChronoMatch™, BIODEFMatch™, LongevityZone™ interactions in real-time.</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
