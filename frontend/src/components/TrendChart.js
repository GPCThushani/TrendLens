// TrendChart.js
import React, { useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Radar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const TrendChart = ({ results, chartType = "line", period = "12", isDarkMode }) => {
  const chartRef = useRef(null);
  if (!results || Object.keys(results).length === 0) return <p>No trend data available.</p>;

  // Use the last N months based on period
  const labels = results[Object.keys(results)[0]].trend_data
    .slice(-period)
    .map(d => d.date);

  const datasets = Object.keys(results).map((kw, idx) => ({
    label: kw,
    data: results[kw].trend_data.slice(-period).map(d => d.value),
    borderColor: `hsl(${idx * 60}, 70%, 50%)`,
    backgroundColor: `hsla(${idx * 60}, 70%, 50%, 0.5)`,
    borderWidth: 2,
    tension: 0.3,
    fill: chartType === "line" ? false : true,
  }));

  const chartData = { labels, datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom", labels: { color: isDarkMode ? "#fff" : "#000" } },
      title: { display: true, text: "Keyword Trend Comparison", color: isDarkMode ? "#fff" : "#000" },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: isDarkMode ? "#fff" : "#000" },
      },
      x: { ticks: { color: isDarkMode ? "#fff" : "#000" } },
    },
  };

  const downloadChart = () => {
    if (!chartRef.current) return;
    const base64 = chartRef.current.toBase64Image();
    const link = document.createElement("a");
    link.href = base64;
    link.download = `${chartType}_chart.png`;
    link.click();
  };

  // Render chart based on type
  let ChartComponent = Line;
  if (chartType === "bar") ChartComponent = Bar;
  else if (chartType === "radar") ChartComponent = Radar;

  return (
    <div style={{ width: "90%", maxWidth: "1200px", margin: "20px auto" }}>
      <div style={{ height: "500px", position: "relative" }}>
        <ChartComponent ref={chartRef} data={chartData} options={options} />
      </div>
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
          Download {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart
        </button>
      </div>
    </div>
  );
};

export default TrendChart;
