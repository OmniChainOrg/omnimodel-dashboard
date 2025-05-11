// components/NEURODiagPanel.tsx

import ExpandedEvent from "../ExpandedEvent";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Loader2, ActivitySquare } from "lucide-react";
import { motion } from "framer-motion";

export default function NEURODiagPanel() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/neurodiag/events")
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
      <Card className="rounded-2xl shadow-xl mt-4">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-2">🧠 NEURODiag™ Activity Feed</h2>
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
