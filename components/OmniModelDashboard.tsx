import React, { useState } from "react";
import ChronoMatchPanel from "./ChronoMatchPanel";
import BIODEFMatchPanel from "./BIODEFMatchPanel";
import LongevityZonePanel from "./LongevityZonePanel";
import NEURODiagPanel from "./NEURODiagPanel";
import OmniVestPanel from "./OmniVestPanel";
import NEUROEdgePanel from "./NEUROEdgePanel";
import BioSynthesisPanel from "./BioSynthesisPanel";
import ImmunoAtlasPanel from "./ImmunoAtlasPanel";
import HopePanel from "./HopePanel";
import OmniversalisDAOPanel from "./OmniversalisDAOPanel";
import TradePharmaPanel from "./TradePharmaPanel";
import RegOpsPanel from "./RegOpsPanel";

const zones = [
  { label: "💰 OmniVest", value: "omnivest" },
  { label: "⏱ ChronoMatch", value: "chronomatch" },
  { label: "🧫 BIODEFMatch", value: "biodefmatch" },
  { label: "🧬 LongevityZone", value: "longevityzone" },
  { label: "🧠 NEURODiag", value: "neurodiag" },
  { label: "🧠 NEUROEdge", value: "neuroedge" },
  { label: "🧬 BioSynthesis", value: "biosynthesis" },
  { label: "🛡 ImmunoAtlas", value: "immunoatlas" },
  { label: "🌈 HOPE", value: "hope" },
  { label: "🧭 OmniversalisDAO", value: "omniversalisdao" },
  { label: "💊 TradePharma", value: "tradepharma" },
  { label: "📜 RegOps", value: "regops" },
];

export default function OmniModelDashboard() {
  const [activeZone, setActiveZone] = useState("omnivest");

  const renderPanel = () => {
    switch (activeZone) {
      case "chronomatch":
        return <ChronoMatchPanel />;
      case "biodefmatch":
        return <BIODEFMatchPanel />;
      case "longevityzone":
        return <LongevityZonePanel />;
      case "neurodiag":
        return <NEURODiagPanel />;
      case "omnivest":
      default:
        return <OmniVestPanel />;
      case "neuroedge":
        return <NEUROEdgePanel />;
      case "biosynthesis":
        return <BioSynthesisPanel />;
      case "immunoatlas":
        return <ImmunoAtlasPanel />;
      case "hope":
        return <HopePanel />;
      case "omniversalisdao":
        return <OmniversalisDAOPanel />;
      case "tradepharma":
        return <TradePharmaPanel />;
      case "regops":
        return <RegOpsPanel />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">OmniModel Dashboard</h1>

      {/* Toggle Tabs */}
      <div className="flex flex-wrap gap-2">
        {zones.map((z) => (
          <button
            key={z.value}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeZone === z.value
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            }`}
            onClick={() => setActiveZone(z.value)}
          >
            {z.label}
          </button>
        ))}
      </div>

      {/* Render Selected Zone */}
      <div className="pt-4">{renderPanel()}</div>
    </div>
  );
}
