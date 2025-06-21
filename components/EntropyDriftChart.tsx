
import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip);

const EntropyDriftChart = () => {
  const data = {
    labels: ["T-4", "T-3", "T-2", "T-1", "Now"],
    datasets: [
      {
        label: "Entropy Drift",
        data: [0.07, 0.12, 0.18, 0.14, 0.10],
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Time"
        }
      },
      y: {
        title: {
          display: true,
          text: "Entropy"
        },
        min: 0,
        max: 0.2
      }
    }
  };

  return <Line data={data} options={options} />;
};

export default EntropyDriftChart;
