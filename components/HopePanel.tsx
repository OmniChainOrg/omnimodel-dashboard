// components/HopePanel.tsx

import ExpandedEvent from "./ExpandedEvent";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Loader2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

type Event = {
  id: string;
  type: string;
  timestamp: number;
  zone: string;
};

export default function HopePanel() {
  const [events, setEvents] = useState<Event[] | null>(null);

  useEffect(() => {
    fetch("/api/hope/events")
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
          <h2 className="text-xl font-semibold mb-2">🌈 HOPEChain™ Activity Feed</h2>
          {!events ? (
            <Loader2 className="animate-spin w-6 h-6" />
          ) : (
            <div className="space-y-2">
              {events.map((event, idx) => (
                <ExpandedEvent key={idx} event={event} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
