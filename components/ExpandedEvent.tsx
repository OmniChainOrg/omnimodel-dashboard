import React from "react";
import { Badge } from "./ui/badge";

interface EventProps {
  event?: {
    type?: string;
    timestamp?: number;
    zone?: string;
    [key: string]: any;
  };
}

const ExpandedEvent: React.FC<EventProps> = ({ event }) => {
  if (!event) {
    return <div className="text-sm text-red-500">Invalid event data</div>;
  }

  const formattedDate = event.timestamp
    ? new Date(event.timestamp).toLocaleString()
    : "Invalid date";

  return (
    <div className="flex justify-between items-center py-2 border-b last:border-0">
      <div>
        <p className="font-medium">{event.type || "Unknown event"}</p>
        <p className="text-sm text-muted-foreground">{formattedDate}</p>
      </div>
      <Badge variant="outline">{event.zone || "Unknown zone"}</Badge>
    </div>
  );
};

export default ExpandedEvent;
