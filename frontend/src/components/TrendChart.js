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
  Filler, // <--- 1. Import Filler
} from "chart.js";
import { Line, Bar, Radar } from "react-chartjs-2";

// 2. Register Filler (Prevents crash on some chart types)
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const TrendChart = ({ results, chartType = "line", period = "12", isDarkMode }) => {
  const chartRef = useRef(null);

  if (!results || Object.keys(results).length === 0) {
    return <p style={{ textAlign: "center", color: isDarkMode ? "#ccc" : "#666" }}>No trend data available.</p>;
  }

  // 3. SAFETY: Filter only keywords that actually have valid trend_data
  const validKeys = Object.keys(results).filter(
    (key) => results[key] && Array.isArray(results[key].trend_data) && results[key].trend_data.length > 0
  );

  if (validKeys.length === 0) {
    return <p style={{ textAlign: "center", color: "red" }}>All keywords failed to load data.</p>;
  }

  // Use the first valid keyword to get the date labels
  const firstKey = validKeys[0];
  const labels = results[firstKey].trend_data
    .slice(-parseInt(period))
    .map((d) => d.date);

  const datasets = validKeys.map((kw, idx) => ({
    label: kw,
    data: results[kw].trend_data.slice(-parseInt(period)).map((d) => d.value),
    borderColor: `hsl(${idx * 60}, 70%, 50%)`,
    backgroundColor: `hsla(${idx * 60}, 70%, 50%, 0.5)`,
    borderWidth: 2,
    tension: 0.3,
    // Fill area for Radar/Bar, but usually not for Line unless desired
    fill: chartType !== "line", 
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
        grid: { color: isDarkMode ? "#444" : "#e5e5e5" }
      },
      x: { 
        ticks: { color: isDarkMode ? "#fff" : "#000" },
        grid: { color: isDarkMode ? "#444" : "#e5e5e5" }
      },
      r: { // Radar chart specific scale
        angleLines: { color: isDarkMode ? "#666" : "#ccc" },
        grid: { color: isDarkMode ? "#444" : "#ddd" },
        pointLabels: { color: isDarkMode ? "#fff" : "#000" },
        ticks: { backdropColor: "transparent" }
      }
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
      <div style={{ textAlign: "center", marginTop: "15px" }}>
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
          Download Chart
        </button>
      </div>
    </div>
  );
};

export default TrendChart;
