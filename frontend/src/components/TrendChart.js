// TrendChart.js
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TrendChart = ({ results }) => {
  if (!results || Object.keys(results).length === 0) return <p>No trend data available.</p>;

  // Prepare data for multiple keywords
  const labels = results[Object.keys(results)[0]].trend_data.map(d => d.date);

  const datasets = Object.keys(results).map((kw, idx) => ({
    label: kw,
    data: results[kw].trend_data.map(d => d.value),
    borderColor: `hsl(${idx * 60}, 70%, 50%)`, // different color for each keyword
    borderWidth: 2,
    tension: 0.3,
    fill: false
  }));

  const chartData = { labels, datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // allows custom height
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: 'Keyword Trend Comparison' }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  return (
    <div style={{ width: '90%', maxWidth: '1200px', height: '500px', margin: '20px auto' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default TrendChart;
