// pages/omnitwin.tsx
// pages/omnitwin.tsx
import React from "react";
import OmniTwinNexusPanel from "@/components/OmniTwinNexusPanel";

export default function OmniTwinPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">OmniTwin — Nexus Operations</h1>
      <OmniTwinNexusPanel />
    </div>
  );
}
