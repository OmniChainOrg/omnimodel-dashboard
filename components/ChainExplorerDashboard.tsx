import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Loader2, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import OmniVestPanel from "../components/OmniVestPanel";
import ChronoMatchPanel from "../components/ChronoMatchPanel";
import BIODEFMatchPanel from "../components/BIODEFMatchPanel";
import LongevityZonePanel from "../components/LongevityZonePanel";
import NEURODiagPanel from "../components/NEURODiagPanel";
import NEUROEdgePanel from "../components/NEURODiagPanel";
import RegOpsPanel from "../components/NEURODiagPanel";
import BioSynthesisPanel from "../components/NEURODiagPanel";
import HopePanel from "../components/NEURODiagPanel";
import ImmunoAtlasPanel from "../components/NEURODiagPanel";
import OmniversalisDAOPanel from "../components/NEURODiagPanel";
import TradePharmaPanel from "../components/NEURODiagPanel";
import SirrenaSimPanel from "../components/NEURODiagPanel";

const zones = [
  { label: "💰 OmniVest", value: "omnivest" },
  { label: "⏱ ChronoMatch", value: "chronomatch" },
  { label: "🧫 BIODEFMatch", value: "biodefmatch" },
  { label: "🧬 LongevityZone", value: "longevityzone" },
  { label: "🧠 NEURODiag", value: "neurodiag" },
  { label: "🧩 NEUROEdge", value: "neuroedge" },
  { label: "📜 RegOps", value: "regops" },
  { label: "🧪 BioSynthesis", value: "biosynthesis" },
  { label: "🌈 HOPE", value: "hope" },
  { label: "🛡 ImmunoAtlas", value: "immunoatlas" },
  { label: "🧭 OmniversalisDAO", value: "omniversalisdao" },
  { label: "💊 TradePharma", value: "tradepharma" },
  { label: "🔁 SirrenaSim", value: "sirrenasim" }
];

export default function ChainExplorerDashboard() {
  const [simulationLog, setSimulationLog] = useState<any>(null);
  const [validators, setValidators] = useState<any[]>([]);
  const [model, setModel] = useState<any>(null);

  useEffect(() => {
    fetch("/api/simulation_trace/latest")
      .then(res => res.json())
      .then(setSimulationLog)
      .catch(() => {});
    fetch("/api/validators")
      .then(res => res.json())
      .then(setValidators)
      .catch(() => {});
    fetch("/api/model_provenance/latest")
      .then(res => res.json())
      .then(setModel)
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
                  {v.status === "active" ? (
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
                  {model.tags.map((tag: string, i: number) => (
                    <Badge key={i}>{tag}</Badge>
                  ))}
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
            <p className="text-sm text-muted-foreground">
              Cross-zone activity coming soon. Monitor ChronoMatch™, BIODEFMatch™, LongevityZone™ interactions in real-time.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* OmniVest Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-3"
      >
        <OmniVestPanel />
      </motion.div>
      
      {/* ChronoMatch Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-3"
      >
        <ChronoMatchPanel />
      </motion.div>

      {/* BIODEFMatch Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-3"
      >
        <BIODEFMatchPanel />
      </motion.div>

      {/* LongevityZone Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-3"
      >
        <LongevityZonePanel />
      </motion.div>

      {/* NEURODiag Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-3"
      >
        <NEURODiagPanel />
      </motion.div>
      
      {/* NEUROEdge Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-3"
      >
        <NEUROEdgePanel />
      </motion.div>

      {/* RegOps Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-3"
      >
        <RegOpsPanel />
      </motion.div>

      {/* BioSynthesis Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-3"
      >
        <BioSynthesisPanel />
      </motion.div>      
      
      {/* Hope Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-3"
      >
        <HopePanel />
      </motion.div>

      {/* ImmunoAtlas Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-3"
      >
        <ImmunoAtlasPanel />
      </motion.div>

      {/* OmniversalisDAO Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-3"
      >
        <OmniversalisDAOPanel />
      </motion.div>

      {/* TradePharma Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-3"
      >
        <TradePharmaPanel />
      </motion.div>

       {/* SirrenaSim Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-3"
      >
        <SirrenaSimPanel />
      </motion.div>

      
    </div>
  );
}
