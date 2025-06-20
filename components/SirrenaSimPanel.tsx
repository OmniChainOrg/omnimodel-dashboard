// components/SirrenaSimPanel.tsx

import ExpandedEvent from "./ExpandedEvent";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Loader2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import AnchorTrail from "@/components/AnchorTrail";

type Event = {
  id: string;
  type: string;
  timestamp: number;
  zone: string;
};

const anchorEvents = [
  {
    id: "anchor-04b92e",
    timestamp: "2025-06-20T00:36:45Z",
    text: "Recursive echo linked RegOps → HOPEChain → SirrenaSim",
    origin: "RegOps",
    target: "SirrenaSim",
    verifiedBy: ["Inference-Agent-α", "RecursiveNode-07"],
  },
  {
    id: "anchor-b8d2aa",
    timestamp: "2025-06-20T00:34:45Z",
    text: "Forecast threshold breached, override logged",
    origin: "HOPEChain",
    target: "Caelis",
    verifiedBy: ["GxP-Agent-3", "TrialPhaseBot"],
  },
];

export default function SirrenaSimPanel() {
  const [events, setEvents] = useState<Event[] | null>(null);

  useEffect(() => {
    fetch("/api/sirrenasim/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch(() => {});
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-1"
    >
      <Card className="rounded-2xl shadow-xl">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-2">🔁 SirrenaSim™ Activity Feed</h2>
          {!events ? (
            <Loader2 className="animate-spin w-6 h-6" />
          ) : (
            <div className="space-y-2">
              {events.map((event, idx) => (
                <ExpandedEvent key={idx} event={event} />
                <AnchorTrail events={anchorEvents} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
