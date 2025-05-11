// LongevityZonePanel.tsx

import ExpandedEvent from "./ExpandedEvent";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Loader2, HeartPulse } from "lucide-react";
import { motion } from "framer-motion";

export default function LongevityZonePanel() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/longevityzone/events")
      .then(res => res.json())
      .then(setEvents)
      .catch(() => {});
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-3"
    >
      <Card className="rounded-2xl shadow-xl mt-6">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-2">🧬 LongevityZone™ Activity Feed</h2>
          {!events.length ? (
            <Loader2 className="animate-spin w-6 h-6" />
          ) : (
            events.map((event, idx) => <ExpandedEvent key={idx} event={event} />)
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
