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
  Filler,
} from "chart.js";
import { Line, Bar, Radar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  BarElement, RadialLinearScale, Title, Tooltip, Legend, Filler
);

const TrendChart = ({ results, chartType = "line", period = "12", isDarkMode }) => {
  const chartRef = useRef(null);

  if (!results || Object.keys(results).length === 0) return <p>No data.</p>;

  // Filter valid keys
  const validKeys = Object.keys(results).filter(k => results[k] && results[k].trend_data);
  if (validKeys.length === 0) return <p>Error loading data.</p>;

  // 1. Setup Labels (Historical + 3 Forecast Months)
  const firstKey = validKeys[0];
  const historicalData = results[firstKey].trend_data.slice(-parseInt(period));
  const historicalLabels = historicalData.map(d => d.date);
  
  // Generate future labels
  const lastDate = new Date(historicalLabels[historicalLabels.length - 1]);
  const futureLabels = [1, 2, 3].map(i => {
    const d = new Date(lastDate);
    d.setMonth(d.getMonth() + i);
    return d.toISOString().split('T')[0]; // YYYY-MM-DD
  });
  
  const labels = [...historicalLabels, ...futureLabels];

  // 2. Build Datasets (Historical Line + Forecast Dashed Line)
  const datasets = [];

  validKeys.forEach((kw, idx) => {
    const baseColor = `hsl(${idx * 60 + 200}, 70%, 50%)`; // Blue-ish spectrum
    
    // Historical Data
    const histValues = results[kw].trend_data.slice(-parseInt(period)).map(d => d.value);
    
    // Forecast Data (Connect last historical point to forecast)
    const forecastValues = results[kw].forecast || [];
    // We pad the beginning with 'null' so the line starts after historical data
    const forecastPlot = Array(histValues.length - 1).fill(null);
    forecastPlot.push(histValues[histValues.length - 1]); // Connection point
    forecastPlot.push(...forecastValues);

    // Add Solid Line (History)
    datasets.push({
      label: `${kw} (History)`,
      data: [...histValues, null, null, null], // Pad end
      borderColor: baseColor,
      backgroundColor: baseColor,
      borderWidth: 2,
      tension: 0.3,
      fill: false,
    });

    // Add Dashed Line (Forecast)
    datasets.push({
      label: `${kw} (Forecast)`,
      data: forecastPlot,
      borderColor: baseColor,
      borderDash: [5, 5], // Dashed line
      borderWidth: 2,
      pointRadius: 4, // Highlight predictions
      fill: false,
    });
  });

  const data = { labels, datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { position: "top", labels: { color: isDarkMode ? "#fff" : "#000" } },
      title: { display: true, text: "Trend Forecast (Next 3 Months)", color: isDarkMode ? "#fff" : "#000" },
    },
    scales: {
      y: { ticks: { color: isDarkMode ? "#fff" : "#000" }, grid: { color: isDarkMode ? "#333" : "#ddd" } },
      x: { ticks: { color: isDarkMode ? "#fff" : "#000" }, grid: { color: isDarkMode ? "#333" : "#ddd" } }
    },
  };

  return (
    <div style={{ height: "400px", padding: "20px" }}>
       <Line ref={chartRef} data={data} options={options} />
    </div>
  );
};

export default TrendChart;
