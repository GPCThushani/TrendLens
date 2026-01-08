import React, { useRef } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Download } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

const SentimentChart = ({ sentiment }) => {
  const chartRef = useRef(null);

  if (!sentiment) return null;

  const data = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [
      {
        data: [sentiment.positive, sentiment.neutral, sentiment.negative],
        backgroundColor: ["#22c55e", "#eab308", "#ef4444"], // Vibrant Green, Yellow, Red
        borderColor: "#0f172a", // Match dark background for clean separation
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Critical: Allows the chart to fit the container
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#e0e0e0",
          font: { size: 12 },
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return ` ${context.label}: ${(context.raw * 100).toFixed(0)}%`;
          },
        },
      },
    },
  };

  const downloadChart = () => {
    if (chartRef.current) {
      const link = document.createElement("a");
      link.download = "sentiment-chart.png";
      link.href = chartRef.current.toBase64Image();
      link.click();
    }
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Chart Container: Strictly defined height prevents explosion/overlap */}
      <div style={{ position: "relative", width: "100%", height: "220px", marginBottom: "15px" }}>
        <Pie ref={chartRef} data={data} options={options} />
      </div>

      <button
        onClick={downloadChart}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          color: "#fff",
          padding: "8px 16px",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "0.85rem",
          transition: "0.2s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)")}
        onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)")}
      >
        <Download size={14} /> Download Pie Chart
      </button>
    </div>
  );
};

export default SentimentChart;