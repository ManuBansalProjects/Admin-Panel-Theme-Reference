// SessionPaymentChart.js
import React from 'react';
import Chart from 'react-apexcharts';

const SessionPaymentChart = () => {
  const chartOptions = {
    chart: {
      type: 'line',
      height: 350,
    },
    stroke: {
      width: [3, 3],
    },
    title: {
      text: 'Sessions Booked vs Payments',
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [0],
    },
    labels: ['June 1', 'June 2', 'June 3', 'June 4', 'June 5'],
    xaxis: {
      type: 'category',
    },
    yaxis: [
      {
        title: {
          text: 'Sessions Booked',
        },
      },
      {
        opposite: true,
        title: {
          text: 'Payments ($)',
        },
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
    },
  };

  const chartSeries = [
    {
      name: 'Sessions Booked',
      type: 'line',
      data: [45, 60, 50, 70, 65],
    },
    {
      name: 'Payments ($)',
      type: 'line',
      data: [900, 1100, 1000, 1400, 1300],
    },
  ];

  return <Chart options={chartOptions} series={chartSeries} type="line" height={350} />;
};

export default SessionPaymentChart;
