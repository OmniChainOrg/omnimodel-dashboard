import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
} from "chart.js";
import EntropyAlertBeacon from "@/components/EntropyAlertBeacon";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip);

export default function EntropyDriftChart() {
  const [entropyPoints, setEntropyPoints] = useState<{ time: string; value: number }[]>([]);

  useEffect(() => {
    const loadEntropy = async () => {
      const res = await fetch("/api/consensus/events");
      const data = await res.json();

      const entropyEvents = data.filter((e: any) =>
        e.payload?.entropyDelta !== undefined
      );

      const mapped = entropyEvents.map((e: any) => ({
        time: new Date(e.timestamp).toLocaleTimeString(),
        value: e.payload.entropyDelta,
      }));

      setEntropyPoints(mapped);
    };

    loadEntropy();
    const interval = setInterval(loadEntropy, 5000);
    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: entropyPoints.map((p) => p.time),
    datasets: [
      {
        label: "Entropy Drift",
        data: entropyPoints.map((p) => p.value),
        fill: false,
        tension: 0.4,
        borderColor: "#8b5cf6", // purple
      },
    ],
  };

  return (
    <div className="mt-6">
      <h4 className="font-bold mb-2 text-purple-700 text-sm">Entropy Drift Monitor</h4>
      {entropyPoints.length > 0 && (
        <EntropyAlertBeacon value={entropyPoints[entropyPoints.length - 1].value} />
      )}
    </div>
  );
}
