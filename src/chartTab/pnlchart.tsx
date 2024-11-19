import React, { useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart,
  ChartData,
  ChartOptions,
  ComplexFillTarget,
  registerables,
} from "chart.js";
import {
  ApiTrades,
  getSumFromTransaction,
} from "../helpers/TransactionHelpers";

import "./pnlchart.css";

Chart.register(...registerables);

interface LineChartComponentProps {
  data: ApiTrades[] | null;
}

interface TradeProps {
  Ticker: string;
  Sum: number;
  LastDate: Date;
}

function parseDate(datestring: string): Date {
  const [day, month, year] = datestring.split(".").map(Number);
  return new Date(year, month - 1, day);
}

function parseData(data: ApiTrades[] | null): TradeProps[] {
  const pointData3: TradeProps[] = [];
  const reversedData = data?.slice().reverse();

  reversedData?.forEach((a) => {
    let totals: [number, number, number] = [0, 0, a.Transactions.length];
    a.Transactions?.forEach((b) => (totals = getSumFromTransaction(b, totals)));

    const tradeData: TradeProps = {
      Ticker: a.Ticker,
      Sum: totals[0],
      LastDate: parseDate(a.Transactions.at(-1)?.Date as string),
    };
    pointData3.push(tradeData);
  });

  return pointData3.sort(
    (a, b) => new Date(a.LastDate).getTime() - new Date(b.LastDate).getTime()
  );
}

const PnLChartComponent: React.FC<LineChartComponentProps> = ({ data }) => {
  const [values, setValues] = useState(() => parseData(data));
  const totals: number[] = [];

  values.forEach((a, index) => {
    if (totals.length === 0) {
      totals.push(a.Sum);
    } else {
      const val = a.Sum + totals[index - 1];
      totals.push(val);
    }
  });

  values.reduce((acc, item) => acc + item.Sum, 0);

  const sums = values.map((point) => point.Sum);
  const labels = values.map(
    (point) => point.LastDate.toDateString() + " " + point.Ticker
  );

  const resultFiller: ComplexFillTarget = {
    target: "origin",
    above: "rgba(0,255,0,0.2)",
    below: "rgba(255,0,0,0.2)",
  };

  const lineChartData: ChartData<"line", number[]> = {
    labels: labels,
    datasets: [
      {
        label: "Total PnL",
        data: totals,
        fill: resultFiller,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,1)",
        pointRadius: 3,
        pointHitRadius: 10,
        tension: 0.2,
      },
    ],
  };

  const barChartData: ChartData<"bar", number[]> = {
    labels: labels,
    datasets: [
      {
        label: "Per Trade PnL",
        data: sums,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.5)",
      },
    ],
  };

  const doughnotChartData = initDoughnutData(values.filter((a) => a.Sum > 0));

  const negDoughnotChartData = initDoughnutData(
    values.filter((a) => a.Sum <= 0)
  );

  const options: ChartOptions = {
    datasets: {
      line: {
        pointHoverBorderWidth: 5,
      },
      bar: {
        borderRadius: 5,
      },
    },
  };

  return (
    <div>
      <Line data={lineChartData} options={options as ChartOptions<"line">} />
      <Bar data={barChartData} options={options as ChartOptions<"bar">} />
      <div className="container-doughnut ">
        {doughnotChartData}
        {negDoughnotChartData}
      </div>
    </div>
  );
};

function initDoughnutData(values: TradeProps[]) {
  const isWinningDoughnut = values[0].Sum > 0;
  const colors = values.map(
    () =>
      "rgba(" +
      Math.floor(Math.random() * (isWinningDoughnut ? 0 : 255)) +
      "," +
      Math.floor(Math.random() * (isWinningDoughnut ? 255 : 0)) +
      "," +
      Math.floor(Math.random() * 122) +
      "," +
      1 +
      ")"
  );
  const doughnotChartData: ChartData<"doughnut", number[]> = {
    labels: values.map((a) => a.Ticker),
    datasets: [
      {
        data: values.map((sum) => sum.Sum),
        backgroundColor: colors,
      },
    ],
  };

  const donutOpts: ChartOptions<"doughnut"> = {
    plugins: {
      title: {
        display: true,
        text: (isWinningDoughnut ? "Winning" : "Losing") + " trades",
      },
    },
  };

  const total = values.reduce((acc, item) => acc + item.Sum, 0);

  return (
    <div className="child">
      <Doughnut data={doughnotChartData} options={donutOpts} />
      Total {total.toFixed(2)} €
    </div>
  );
}

export default PnLChartComponent;
