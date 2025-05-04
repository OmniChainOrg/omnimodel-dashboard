// components/NEURODiagPanel.tsx

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Loader2, ActivitySquare } from "lucide-react";
import { motion } from "framer-motion";

export default function NEURODiagPanel() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/neurodiag/events")
      .then((res) => res.json())
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
          <h2 className="text-xl font-semibold mb-2">🧠 NEURODiag™ Activity Feed</h2>
          {!events.length ? (
            <Loader2 className="animate-spin w-6 h-6" />
          ) : (
            <ul className="space-y-2">
              {events.map((e, idx) => (
                <li key={idx} className="flex items-center justify-between border-b last:border-none py-2">
                  <span className="text-sm">{e.message}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{new Date(e.timestamp).toLocaleString()}</span>
                    <Badge variant="outline">{e.zone}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

