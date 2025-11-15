// SentimentChart.js
import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const SentimentChart = ({ sentiment }) => {
  if (!sentiment) {
    return <p>No sentiment data available.</p>;
  }

  const chartData = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [
      {
        data: [
          sentiment.positive || 0,
          sentiment.neutral || 0,
          sentiment.negative || 0
        ],
        backgroundColor: ["#4caf50", "#ffc107", "#f44336"],
        borderColor: ["#ffffff"],
        borderWidth: 1,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div style={{ width: "350px", marginTop: "20px" }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default SentimentChart;
