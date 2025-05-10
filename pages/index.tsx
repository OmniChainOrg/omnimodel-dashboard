// pages/index.tsx

import React from "react";
import OmniVestPanel from "../components/OmniVestPanel";
import ChronoMatchPanel from "../components/ChronoMatchPanel";
import BIODEFMatchPanel from "../components/BIODEFMatchPanel";
import LongevityZonePanel from "../components/LongevityZonePanel";
import NEURODiagPanel from "../components/NEURODiagPanel";


export default function Home() {
  return (
    <div className="p-6 font-sans space-y-6">
      <h1 className="text-3xl font-bold mb-4">OmniModel Dashboard</h1>

      {/* OmniVest Panel */}
      <OmniVestPanel />
      
      {/* ChronoMatch Panel */}
      <ChronoMatchPanel />

      {/* BIODEFMatch Panel */}
      <BIODEFMatchPanel />
      
      {/* LongevityZone Panel */}
      <LongevityZonePanel />

      {/* NEURODiag Panel */}
      <NEURODiagPanel />
      
    </div>
  );
}



// Inside the return block:


