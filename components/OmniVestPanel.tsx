// OmniVestPanel.tsx

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface InvestmentEvent {
  type: string;
  timestamp: number;
  zone: string;
}

export default function OmniVestPanel() {
  const [events, setEvents] = useState<InvestmentEvent[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/omnivest/events")
      .then((res) => res.json())
      .then((data) => setEvents(data.reverse()))
      .catch(() => {});
  }, []);

  const filtered = events.filter(
    (e) =>
      (e.zone || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.type || "").toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-3"
    >
      <Card className="rounded-2xl shadow-xl border border-yellow-400">
        <CardContent className="p-4">
          <h2 className="text-xl font-bold text-yellow-500 mb-3">
            💰 OmniVest™ Investment Feed
          </h2>

          <input
            type="text"
            placeholder="🔍 Filter by zone or keyword"
            className="mb-4 w-full p-2 rounded-md border border-gray-300 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {!filtered.length ? (
            <Loader2 className="animate-spin w-6 h-6 text-yellow-400 mx-auto" />
          ) : (
            filtered.map((event, idx) => (
              <div
                key={idx}
                className="py-2 border-b last:border-0 text-sm space-y-1"
              >
                <p className="font-medium">{event.type}</p>
                <p className="text-muted-foreground">
                  {new Date(event.timestamp).toLocaleString()}
                </p>
                <Badge>{event.zone}</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
