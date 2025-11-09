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
  const chartData = {
    labels: data.map(d => d.date),
    datasets: [{
      label: 'Mentions',
      data: data.map(d => d.count),
      borderColor: 'blue',
      fill: false
    }]
  };
  return <Line data={chartData} />;
};

export default TrendChart;
