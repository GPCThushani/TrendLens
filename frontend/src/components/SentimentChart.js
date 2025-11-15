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
    maintainAspectRatio: false, // allow chart to fill container
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div
      style={{
        width: "100%",         // take full width of parent
        maxWidth: "500px",     // max width on large screens
        height: "400px",       // height to make it more visible
        margin: "20px auto"    // center horizontally and add top/bottom margin
      }}
    >
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default SentimentChart;
