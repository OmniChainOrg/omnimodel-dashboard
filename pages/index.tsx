// pages/index.tsx

import React from "react";
import ChronoMatchPanel from "../components/ChronoMatchPanel";

export default function Home() {
  return (
    <div className="p-6 font-sans">
      <h1 className="text-3xl font-bold mb-4">OmniModel Dashboard</h1>
      <ChronoMatchPanel />
    </div>
  );
}
