import React, { useEffect, useState } from "react";

export default function OmniTwinNexusPanel() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/consensus/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load consensus events", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-2">🧠 OmniTwin Nexus Panel</h2>
      <p className="mb-4">
        Welcome to the OmniTwin Nexus — where recursive consensus meets intelligent action.
      </p>
      <ul className="list-disc list-inside text-sm space-y-1 mb-4">
        <li>Cross-zone anchoring powered by SHOPE simulation trace</li>
        <li>Live consensus calculation based on <i>drift entropy</i>, alignment, and anchoring</li>
        <li>Epistemic fusion with <b>SirrenaSim</b> and <b>CE² Protocols</b></li>
      </ul>
      {loading ? (
        <p className="italic text-gray-600">Loading events...</p>
      ) : (
        <div>
          <h3 className="text-lg font-semibold mt-4 mb-2">📡 Recent Consensus Events</h3>
          <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-80">
            {JSON.stringify(events, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
