import React, { useRef } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const SentimentChart = ({ sentiment }) => {
  const chartRef = useRef(null);

  if (!sentiment) return <p>No sentiment data available.</p>;

  const chartData = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [
      {
        data: [sentiment.positive, sentiment.neutral, sentiment.negative],
        backgroundColor: ["#4caf50", "#ffc107", "#f44336"],
        borderColor: ["#ffffff"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" } },
  };

  const downloadChart = () => {
    if (!chartRef.current) return;
    const base64 = chartRef.current.toBase64Image();
    const link = document.createElement("a");
    link.href = base64;
    link.download = "sentiment_chart.png";
    link.click();
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "500px",
        height: "400px",
        margin: "20px auto",
      }}
    >
      <Pie ref={chartRef} data={chartData} options={options} />
      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <button
          onClick={downloadChart}
          style={{
            padding: "10px 20px",
            fontSize: "14px",
            backgroundColor: "#4caf50",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#4caf50")}
        >
          Download Pie Chart
        </button>
      </div>
    </div>
  );
};

export default SentimentChart;
