import React, { useEffect, useState } from 'react';

interface AnchorEvent {
  timestamp: string;
  type: string;
  description: string;
}

const AnchoringTimeline: React.FC<{ zoneId: string }> = ({ zoneId }) => {
  const [events, setEvents] = useState<AnchorEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Placeholder fetch - replace with real endpoint
    fetch(`/api/zones/${zoneId}/anchors`)
      .then(res => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data: AnchorEvent[]) => {
        setEvents(data);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load anchor events');
      })
      .finally(() => setLoading(false));
  }, [zoneId]);

  if (loading) return <p className="text-center text-gray-600">Loading anchor timeline...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  if (events.length === 0) {
    return <p className="text-center text-gray-500">No anchor events yet for this zone.</p>;
  }

  return (
    <ul className="space-y-2">
      {events.map(evt => (
        <li key={evt.timestamp} className="flex justify-between bg-gray-50 p-2 rounded">
          <div>
            <p className="text-sm font-medium text-gray-800">{evt.type}</p>
            <p className="text-xs text-gray-500">{evt.description}</p>
          </div>
          <span className="text-xs text-gray-400">{new Date(evt.timestamp).toLocaleString()}</span>
        </li>
      ))}
    </ul>
  );
};

export default AnchoringTimeline;
