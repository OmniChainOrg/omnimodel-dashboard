import React, { useEffect, useState } from "react";
import type { ConsensusEvent } from "@/types/ConsensusEvent";

const ZONE_COLORS: Record<string, string> = {
  TradePharma: "bg-yellow-100 border-yellow-400",
  SirrenaSim: "bg-indigo-100 border-indigo-400",
  CE2: "bg-green-100 border-green-400",
  default: "bg-gray-100 border-gray-300",
};

export default function OmniTwinNexusPanel() {
  const [events, setEvents] = useState<ConsensusEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/consensus/events");
      const data: ConsensusEvent[] = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Error fetching events", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pt-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🧠</span>
        <h2 className="text-2xl font-bold">OmniTwin Nexus Panel</h2>
        <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-white bg-red-600 rounded-full animate-pulse">
          LIVE
        </span>
      </div>

      <p className="mb-4 text-sm text-gray-700">
        Welcome to the OmniTwin Nexus — where recursive consensus meets intelligent action.
      </p>
      <ul className="list-disc list-inside text-sm space-y-1 mb-6">
        <li>Cross-zone anchoring powered by <b>SHOPE</b> simulation trace</li>
        <li>Live consensus calculation based on <i>drift entropy</i>, alignment, and anchoring</li>
        <li>Epistemic fusion with <b>SirrenaSim</b> and <b>CE² Protocols</b></li>
      </ul>

      <h3 className="text-lg font-semibold mb-2">🛰 Recent Consensus Events</h3>

      {loading ? (
        <p className="italic text-gray-600">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="text-sm text-gray-500">No consensus events available yet.</p>
      ) : (
        <div className="space-y-4 text-sm">
          {events.map((evt) => {
            const zoneClass = ZONE_COLORS[evt.zone] || ZONE_COLORS.default;
            return (
              <div
                key={evt.id}
                className={`border-l-4 pl-4 rounded-md shadow-sm ${zoneClass} p-3`}
              >
                <div className="text-xs text-gray-500">
                  {new Date(evt.timestamp).toLocaleString()}
                </div>
                <div className="font-semibold">{evt.zone}</div>
                <div className="capitalize text-gray-700 mb-1">
                  {evt.action.replace(/_/g, " ")}
                </div>
                <div className="text-gray-600">
                  {Object.entries(evt.payload).map(([key, value]) => (
                    <div key={key}>
                      <span className="font-medium">{key}:</span> {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </div>
                  ))}

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
