// SentimentChart.js
import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const SentimentChart = ({ sentiment }) => {
  const chartData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [{
      data: [sentiment.positive, sentiment.neutral, sentiment.negative],
      backgroundColor: ['#4caf50','#ffc107','#f44336']
    }]
  };
  return <Pie data={chartData} />;
};

export default SentimentChart;
