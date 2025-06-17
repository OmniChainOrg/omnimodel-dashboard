import React, { useState } from "react";
import OmniTwin from "@/components/OmniTwin";
import CE2ZonePanel from "./CE2ZonePanel";
import OmniTwinNexusPanel from "./OmniTwinNexusPanel";
import OmniVestPanel from "./OmniVestPanel";
import ChronoMatchPanel from "./ChronoMatchPanel";
import BIODEFMatchPanel from "./BIODEFMatchPanel";
import LongevityZonePanel from "./LongevityZonePanel";
import NEURODiagPanel from "./NEURODiagPanel";
import NEUROEdgePanel from "./NEUROEdgePanel";
import RegOpsPanel from "./RegOpsPanel";
import BioSynthesisPanel from "./BioSynthesisPanel";
import ImmunoAtlasPanel from "./ImmunoAtlasPanel";
import HOPEChainPanel from "./HOPEChainPanel";
import OmniversalisDAOPanel from "./OmniversalisDAOPanel";
import TradePharmaPanel from "./TradePharmaPanel";
import SirrenaSimPanel from "./SirrenaSimPanel";


const zones = [
  { label: "💠 CE²", value: "ce2" },
  { label: "♾️ OmniTwin", value: "omnitwin" },
  { label: "💰 OmniVest", value: "omnivest" },
  { label: "⏱ ChronoMatch", value: "chronomatch" },
  { label: "🧫 BIODEFMatch", value: "biodefmatch" },
  { label: "🧬 LongevityZone", value: "longevityzone" },
  { label: "🧠 NEURODiag", value: "neurodiag" },
  { label: "🧩 NEUROEdge", value: "neuroedge" },
  { label: "📜 RegOps", value: "regops" },
  { label: "🧪 BioSynthesis", value: "biosynthesis" },
  { label: "🛡 ImmunoAtlas", value: "immunoatlas" },
  { label: "🌈 HOPEChain", value: "hope" },
  { label: "🧭 OmniversalisDAO", value: "omniversalisdao" },
  { label: "💊 TradePharma", value: "tradepharma" },
  { label: "🔁 SirrenaSim", value: "sirrenasim" },
];

export default function OmniModelDashboard() {
  const [activeZone, setActiveZone] = useState("omnivest");

  const renderPanel = () => {
    switch (activeZone) {
      case "ce2":
        return <CE2ZonePanel />;
      case "omnitwin":
        return (
          <div>
            <OmniTwin />
            <div className="mt-6">
              <OmniTwinNexusPanel />
            </div>
          </div>
        );
      case "omnivest":
        return <OmniVestPanel />;
      case "chronomatch":
        return <ChronoMatchPanel />;
      case "biodefmatch":
        return <BIODEFMatchPanel />;
      case "longevityzone":
        return <LongevityZonePanel />;
      case "neurodiag":
        return <NEURODiagPanel />;
      case "neuroedge":
        return <NEUROEdgePanel />;
      case "regops":
        return <RegOpsPanel />;
      case "biosynthesis":
        return <BioSynthesisPanel />;
      case "immunoatlas":
        return <ImmunoAtlasPanel />;
      case "hope":
        return <HOPEChainPanel />;
      case "omniversalisdao":
        return <OmniversalisDAOPanel />;
      case "tradepharma":
        return <TradePharmaPanel />;
      case "sirrenasim":
        return <SirrenaSimPanel />;
      default:
        return <OmniVestPanel />;
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
