import React, { useEffect, useState } from "react";
import { Zone } from "../hooks/useZoneArchetype";
import ExpandedEvent from "./ExpandedEvent";
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

type SirrenaSimPanelProps = {
  zone: Zone;
};

export default function SirrenaSimPanel({ zone }: SirrenaSimPanelProps) {
  const [events, setEvents] = useState<Event[] | null>(null);

  useEffect(() => {
    fetch(`/api/sirrenasim/events?zone=${zone.id}`)
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch(() => setEvents([]));
  }, [zone.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-1"
    >
      <Card className="rounded-2xl shadow-xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">🔁 SirrenaSim™ Activity Feed</h2>
            <span className="text-sm text-gray-500">Zone: {zone.name}</span>
          </div>
          {!events ? (
            <Loader2 className="animate-spin w-6 h-6" />
          ) : (
            <div className="space-y-2">
              {events.map((event, idx) => (
                <React.Fragment key={event.id || idx}>
                  <ExpandedEvent event={event} />
                  <AnchorTrail events={events} />
                </React.Fragment>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
