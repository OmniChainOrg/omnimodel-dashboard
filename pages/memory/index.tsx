// --- pages/memory/index.tsx (updated to accept zone) ---
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Zone } from "../../hooks/useZoneArchetype";

interface MemoryIndexPageProps {
  zone: Zone;
}

export default function MemoryIndexPage({ zone }: MemoryIndexPageProps) {
  const [anchors, setAnchors] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/memory/anchor?zone=${zone.id}`)
      .then((res) => res.json())
      .then((data) => setAnchors(data.anchors))
      .catch(() => setAnchors([]));
  }, [zone.id]);

  return (
    <main className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">
        🧠 L5 Memory Anchors for {zone.name}
      </h2>
      {anchors.length === 0 ? (
        <p className="text-muted-foreground">No memory anchors found.</p>
      ) : (
        anchors.map((anchor, idx) => (
          <Card key={idx} className="rounded-xl shadow">
            <CardContent className="p-4 space-y-1">
              <h3 className="font-semibold">{anchor.label}</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(anchor.timestamp).toLocaleString()}
              </p>
              <p className="text-xs">Anchor ID: {anchor.anchor_id}</p>
              <p className="text-sm italic text-muted-foreground">
                “{anchor.snapshot}”
              </p>
              <Badge variant="outline">Stored by: {anchor.stored_by}</Badge>
              <div className="text-xs mt-1">
                Verified by: {anchor.verified_by.join(", ")}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </main>
  );
}
