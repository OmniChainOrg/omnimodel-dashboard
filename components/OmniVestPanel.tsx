import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Loader2, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export default function OmniVestPanel() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/omnivest/events")
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
          <h2 className="text-xl font-semibold mb-2">💰 OmniVest™ Investment Feed</h2>
          {!events.length ? (
            <Loader2 className="animate-spin w-6 h-6" />
          ) : (
            events.map((e, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium">{e.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(e.timestamp).toLocaleString()}
                  </p>
                </div>
                <Badge>{e.project}</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
