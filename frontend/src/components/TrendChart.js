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

const TrendChart = ({ data }) => {
  if (!data || data.length === 0) return <p>No trend data available.</p>;

  const chartData = {
    labels: data.map(d => d.date),
    datasets: [{
      label: 'Trend Value',
      data: data.map(d => d.value),   // ✔ FIXED
      borderColor: 'blue',
      borderWidth: 2,
      tension: 0.3,
      fill: false
    }]
  };

  return <Line data={chartData} />;
};

export default TrendChart;
