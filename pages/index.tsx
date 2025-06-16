// pages/index.tsx

import React from "react";
import Nav from "@/components/Nav";
import OmniModelDashboard from "@/components/OmniModelDashboard";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="p-4">
        <OmniModelDashboard />
      </main>
    </>
  );
}
