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

  const validKeys = Object.keys(results).filter(k => results[k] && results[k].trend_data);
  if (validKeys.length === 0) return <p>Error loading data.</p>;

  // 1. Setup Labels
  const firstKey = validKeys[0];
  const historicalData = results[firstKey].trend_data.slice(-parseInt(period));
  const historicalLabels = historicalData.map(d => d.date);
  
  const lastDate = new Date(historicalLabels[historicalLabels.length - 1]);
  const futureLabels = [1, 2, 3].map(i => {
    const d = new Date(lastDate);
    d.setMonth(d.getMonth() + i);
    return d.toISOString().split('T')[0];
  });
  
  const labels = [...historicalLabels, ...futureLabels];

  // 2. Build Datasets
  const datasets = [];

  validKeys.forEach((kw, idx) => {
    const baseColor = `hsl(${idx * 60 + 200}, 70%, 50%)`;
    
    const histValues = results[kw].trend_data.slice(-parseInt(period)).map(d => d.value);
    const forecastValues = results[kw].forecast || [];
    
    // Pad forecast array so it starts exactly where history ends
    const forecastPlot = Array(histValues.length - 1).fill(null);
    forecastPlot.push(histValues[histValues.length - 1]);
    forecastPlot.push(...forecastValues);

    // Historical Line (Solid)
    datasets.push({
      label: `${kw}`,
      data: [...histValues, null, null, null],
      borderColor: baseColor,
      backgroundColor: baseColor,
      borderWidth: 3, // Thicker line
      tension: 0.4,   // Smoother curve
      pointRadius: 0, // Hide points for cleaner look
      fill: false,
    });

    // Forecast Line (Distinct Style)
    datasets.push({
      label: `${kw} (Forecast)`,
      data: forecastPlot,
      borderColor: '#ffffff', // Make it WHITE to stand out against colored lines
      borderDash: [5, 5],     // Dotted
      borderWidth: 2,
      pointRadius: 4,         // Show points for predictions
      pointBackgroundColor: baseColor,
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
      title: { display: true, text: "Historical vs. AI Forecast", color: isDarkMode ? "#fff" : "#000" },
    },
    scales: {
      y: { ticks: { color: isDarkMode ? "#bbb" : "#666" }, grid: { color: isDarkMode ? "#333" : "#ddd" } },
      x: { ticks: { color: isDarkMode ? "#bbb" : "#666" }, grid: { color: isDarkMode ? "#333" : "#ddd" } }
    },
  };

  return (
    <div style={{ height: "400px", width: "100%", padding: "10px" }}>
       <Line ref={chartRef} data={data} options={options} />
    </div>
  );
};

export default TrendChart;