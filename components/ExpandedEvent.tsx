import React from "react";

interface Event {
  timestamp?: number;
  zone?: string;
  type?: string;
  description?: string;
  validator_id?: string;
  confidence?: number;
  data_source?: string;
}

interface ExpandedEventProps {
  event?: Event; // optional to prevent crash on undefined
}

const ExpandedEvent: React.FC<ExpandedEventProps> = ({ event }) => {
  if (!event) {
    return <div className="text-red-600">Error: Event data not available.</div>;
  }

  const formattedDate = event.timestamp
    ? new Date(event.timestamp).toLocaleString()
    : "Invalid timestamp";

  return (
    <div className="p-4 rounded-lg shadow-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
      <h3 className="text-lg font-semibold mb-1">
        {event.type || "Unknown event type"}
      </h3>
      <p className="text-sm text-zinc-500 mb-2">
        {formattedDate} — {event.zone || "Unknown zone"}
      </p>
      {event.description && <p className="mb-2">{event.description}</p>}

      <div className="text-xs text-zinc-400 space-y-1">
        {event.validator_id && <p>Validator ID: {event.validator_id}</p>}
        {typeof event.confidence === "number" && (
          <p>Confidence: {event.confidence}%</p>
        )}
        {event.data_source && <p>Source: {event.data_source}</p>}
      </div>
    </div>
  );
};

export default ExpandedEvent;
