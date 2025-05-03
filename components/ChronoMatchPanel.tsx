import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ChronoMatchPanel() {
  const [events, setEvents] = useState(null);

  useEffect(() => {
    fetch("/api/chronomatch/events")
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
      <Card className="rounded-2xl shadow-xl mt-4">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-2">⏱️ ChronoMatch Event Timeline</h2>
          {!events ? (
            <Loader2 className="animate-spin w-6 h-6" />
          ) : (
            <ul className="space-y-2">
              {events.map((e, idx) => (
                <li key={idx} className="border-b pb-2 last:border-0">
                  <p><strong>ID:</strong> {e.event_id}</p>
                  <p><strong>Type:</strong> {e.type}</p>
                  <p><strong>Matched Zone:</strong> <Badge>{e.matched_zone}</Badge></p>
                  <p><strong>Confidence:</strong> {parseFloat(e.confidence) * 100}%</p>
                  <p className="text-sm text-muted-foreground">
                    ⏰ {new Date(e.timestamp).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
'''

# Write both files
with open("/mnt/data/pages/api/chronomatch/events.ts", "w") as f:
    f.write(api_file_content)

with open("/mnt/data/components/ChronoMatchPanel.tsx", "w") as f:
    f.write(ui_file_content)
