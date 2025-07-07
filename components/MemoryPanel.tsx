// pages/memory/index.tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function MemoryIndexPage() {
  const { query } = useRouter();
  const zoneId = Array.isArray(query.zone) ? query.zone[0] : query.zone;
  const [anchors, setAnchors] = useState<any[]>([]);

  useEffect(() => {
    if (!zoneId) return;
    fetch(`/api/memory/anchor?zone=${zoneId}`)
      .then((res) => res.json())
      .then((data) => setAnchors(data.anchors))
      .catch(() => setAnchors([]));
  }, [zoneId]);

  if (!zoneId) return <p>Loading...</p>;

  return (
    <main className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">🧠 L5 Memory Anchors for {zoneId}</h2>
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
