// components/EntropyDriftChart.tsx
import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Filler,
  CategoryScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Filler,
  CategoryScale
);

const EntropyDriftChart = () => {
  const entropyData = [
    { timestamp: "2025-06-20T10:52:56Z", value: 0.07 },
    { timestamp: "2025-06-20T10:52:45Z", value: 0.18 },
    { timestamp: "2025-06-20T10:53:01Z", value: 0.14 },
  ];

  const data = {
    labels: entropyData.map((point) => new Date(point.timestamp)),
    datasets: [
      {
        label: "Entropy Drift",
        data: entropyData.map((point) => point.value),
        fill: true,
        borderColor: "rgba(128,0,255,0.7)",
        backgroundColor: "rgba(128,255,128,0.1)",
        tension: 0.5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) =>
            `Entropy: ${tooltipItem.raw}`,
        },
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          tooltipFormat: "yyyy-MM-dd HH:mm:ss",
        },
        title: {
          display: true,
          text: "Timestamp",
        },
      },
      y: {
        min: 0,
        max: 0.2,
        title: {
          display: true,
          text: "Entropy",
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default EntropyDriftChart;
