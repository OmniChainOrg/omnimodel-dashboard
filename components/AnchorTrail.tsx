import React from "react";

interface AnchorEvent {
  id: string;
  timestamp: string;
  text: string;
  origin: string;
  target: string;
  verifiedBy: string[];
}

interface AnchorTrailProps {
  events: AnchorEvent[];
}

export default function AnchorTrail({ events }: AnchorTrailProps) {
  return (
    <div className="relative mt-8 mb-4">
      <h4 className="text-sm font-semibold mb-2 text-rose-700">🧬 Anchor Trail: Synaptic Threads</h4>
      <div className="space-y-4 border-l-2 border-purple-300 pl-4 relative">
        {events.map((event, index) => (
          <div
            key={event.id}
            className="relative animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="absolute left-[-12px] top-1.5 w-3 h-3 bg-purple-500 rounded-full shadow-md animate-pulse" />
            <div className="text-xs text-gray-500">{new Date(event.timestamp).toLocaleString()}</div>
            <div className="text-sm font-medium text-purple-800">{event.text}</div>
            <div className="text-xs text-gray-600">
              Origin: {event.origin} → Target: {event.target}
            </div>
            <div className="text-xs italic text-blue-600">
              Verified by: {event.verifiedBy.join(", ")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

