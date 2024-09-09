import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, ChartData, ChartOptions, registerables } from "chart.js";
import { Transaction } from "./Trades";

Chart.register(...registerables);

interface LineChartComponentProps {
  data: Transaction[];
}

const PnLChartComponent: React.FC<LineChartComponentProps> = ({ data }) => {
  // TODO add data parsing
  const pointData = [
    { x: 1, y: 2 },
    { x: 2, y: 3 },
    { x: 3, y: 4 },
    { x: 4, y: 5 },
    { x: 5, y: 6 },
  ];
  const parseData = () => {};

  //console.log(data);

  const chartData: ChartData<"line"> = {
    labels: pointData.map((point) => point.x),
    datasets: [
      {
        label: "Line Chart",
        data: pointData.map((point) => point.y),
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,1)",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    scales: {
      x: {
        type: "linear",
        position: "bottom",
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default PnLChartComponent;
