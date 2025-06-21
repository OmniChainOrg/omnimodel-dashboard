// components/EntropyDriftChart.tsx
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip);

const EntropyDriftChart = () => {
  const [data, setData] = useState([
    { timestamp: new Date().toISOString(), entropy: 0.07 },
    { timestamp: new Date(Date.now() + 15000).toISOString(), entropy: 0.12 },
    { timestamp: new Date(Date.now() + 30000).toISOString(), entropy: 0.18 },
    { timestamp: new Date(Date.now() + 45000).toISOString(), entropy: 0.14 },
    { timestamp: new Date(Date.now() + 60000).toISOString(), entropy: 0.10 }
  ]);

  const chartData = {
    labels: data.map((entry) => entry.timestamp),
    datasets: [
      {
        label: "Entropy Over Time",
        data: data.map((entry) => entry.entropy),
        fill: false,
        borderColor: "purple",
        tension: 0.4,
        pointRadius: 3,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        type: "time" as const,
        time: {
          tooltipFormat: "HH:mm:ss",
        },
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        beginAtZero: true,
        max: 0.2,
        title: {
          display: true,
          text: "Entropy",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) =>
            `Entropy: ${context.parsed.y.toFixed(3)}`,
        },
      },
    },
  };

  return <Line data={chartData} options={chartOptions} />;
};

export default EntropyDriftChart;
