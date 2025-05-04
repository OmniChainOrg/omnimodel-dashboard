// pages/index.tsx

import React from "react";
import ChronoMatchPanel from "../components/ChronoMatchPanel";
import BIODEFMatchPanel from "../components/BIODEFMatchPanel";

export default function Home() {
  return (
    <div className="p-6 font-sans space-y-6">
      <h1 className="text-3xl font-bold mb-4">OmniModel Dashboard</h1>

      {/* ChronoMatch Panel */}
      <ChronoMatchPanel />

      {/* BIODEFMatch Panel */}
      <BIODEFMatchPanel />
    </div>
  );
}
