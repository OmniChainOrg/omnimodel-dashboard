// components/ChronoMatchPanel.tsx

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ActivitySquare } from "lucide-react";
import { motion } from "framer-motion";

interface Event {
  timestamp: number;
  zone: string;
  validator: string;
  action: string;
}

export default function ChronoMatchPanel() {
  const [events, setEvents] = useState<Event[] | null>(null);

  useEffect(() => {
    fetch("/api/chronomatch/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch(() => setEvents([]));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-3"
    >
      <Card className="rounded-2xl shadow-xl mt-6">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <ActivitySquare className="w-5 h-5 text-purple-600" />
            ChronoMatch™ Activity Feed
          </h2>
          {!events ? (
            <Loader2 className="animate-spin w-6 h-6" />
          ) : events.length === 0 ? (
            <p className="text-sm text-muted-foreground">No events logged yet.</p>
          ) : (
            <div className="space-y-2">
              {events.map((e, idx) => (
                <div
                  key={idx}
                  className="border-b last:border-none pb-2 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">
                      <span className="text-purple-600">{e.validator}</span> {e.action} in <strong>{e.zone}</strong>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(e.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="outline">{e.zone}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
