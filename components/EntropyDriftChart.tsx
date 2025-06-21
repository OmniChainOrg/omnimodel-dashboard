// components/EntropyDriftChart.tsx
import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip
);

const EntropyDriftChart = () => {
  const entropyData = [
    { label: "10:52:56", value: 0.07 },
    { label: "10:52:45", value: 0.18 },
    { label: "10:53:01", value: 0.14 },
  ];

  const data = {
    labels: entropyData.map((point) => point.label),
    datasets: [
      {
        label: "Entropy Drift",
        data: entropyData.map((point) => point.value),
        borderColor: "rgba(128,0,255,0.7)",
        backgroundColor: "rgba(128,255,128,0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `Entropy: ${tooltipItem.raw}`,
        },
      },
    },
    scales: {
      x: {
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
