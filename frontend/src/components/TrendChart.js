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

  // Filter keys that actually have data
  const validKeys = Object.keys(results).filter(k => results[k] && results[k].trend_data);
  if (validKeys.length === 0) return <p>Error loading data.</p>;

  // 1. Setup Labels (History + Forecast dates)
  const firstKey = validKeys[0];
  const historicalData = results[firstKey].trend_data.slice(-parseInt(period));
  const historicalLabels = historicalData.map(d => d.date);
  
  // Generate next 3 months for forecast labels
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
    // Generate a color for this keyword
    const baseColor = `hsl(${idx * 60 + 200}, 70%, 50%)`; 
    
    // Historical Data Points
    const histValues = results[kw].trend_data.slice(-parseInt(period)).map(d => d.value);
    const forecastValues = results[kw].forecast || [];
    
    // Create an array for forecast that starts with nulls so it lines up
    const forecastPlot = Array(histValues.length - 1).fill(null);
    // Connect the last historical point so the line is continuous
    forecastPlot.push(histValues[histValues.length - 1]); 
    forecastPlot.push(...forecastValues);

    // --- Dataset 1: Historical Line (Solid) ---
    datasets.push({
      label: `${kw}`,
      data: [...histValues, null, null, null], // Pad end with nulls
      borderColor: baseColor,
      backgroundColor: baseColor,
      borderWidth: 2,
      tension: 0.3,
      pointRadius: 2,
      fill: chartType !== "line", // Fill only if not line chart
    });

    // --- Dataset 2: Forecast Line (High Visibility) ---
    datasets.push({
      label: `${kw} Forecast`,
      data: forecastPlot,
      borderColor: '#00ffff', // BRIGHT CYAN for visibility
      borderDash: [10, 6],    // Big dashes
      borderWidth: 3,         // Thicker line
      pointRadius: 5,         // Visible dots
      pointBackgroundColor: '#fff',
      pointBorderColor: '#00ffff',
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
      title: { display: true, text: "Trend History & AI Forecast", color: isDarkMode ? "#fff" : "#000" },
    },
    scales: {
      y: { 
        beginAtZero: true,
        ticks: { color: isDarkMode ? "#bbb" : "#666" }, 
        grid: { color: isDarkMode ? "#333" : "#ddd" } 
      },
      x: { 
        ticks: { color: isDarkMode ? "#bbb" : "#666" }, 
        grid: { color: isDarkMode ? "#333" : "#ddd" } 
      }
    },
  };

  // Render chart based on type
  let ChartComponent = Line;
  if (chartType === "bar") ChartComponent = Bar;
  else if (chartType === "radar") ChartComponent = Radar;

  return (
    <div style={{ height: "400px", width: "100%", padding: "10px" }}>
       <ChartComponent ref={chartRef} data={data} options={options} />
    </div>
  );
};

export default TrendChart;