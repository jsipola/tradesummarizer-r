import React, { useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart,
  ChartData,
  ChartOptions,
  ComplexFillTarget,
  registerables,
} from "chart.js";
import { ApiTrades, Transaction } from "./Trades";

Chart.register(...registerables);

interface LineChartComponentProps {
  data: ApiTrades[] | null;
}

interface TradeProps {
  Ticker: string;
  Sum: number;
  LastDate: Date;
}

function getSumFromTransaction(
  item: Transaction,
  totals: [number, number, number]
): [number, number, number] {
  if (item.Type === "Osto") {
    return [totals[0] - item.Amount, totals[1] + item.Shares, totals[2] - 1];
  }
  if (item.Type === "Myynti" && totals[1] > 0) {
    return [totals[0] + item.Amount, totals[1] - item.Shares, totals[2] - 1];
  }
  return totals;
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
      //Total: totals[0],
      LastDate: parseDate(a.Transactions.at(-1)?.Date as string), //new Date(a.Transactions.at(-1)?.Date as Date),
    };
    pointData3.push(tradeData);
  });

  return pointData3.sort(
    (a, b) => new Date(a.LastDate).getTime() - new Date(b.LastDate).getTime()
  );
}

const PnLChartComponent: React.FC<LineChartComponentProps> = ({ data }) => {
  const [values, _] = useState(() => parseData(data));
  const totals: number[] = [];

  values.forEach((a, index) => {
    if (totals.length == 0) {
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
    above: "rgba(0,122,0,10)",
    below: "rgba(122,0,0,10)",
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
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 3,
        pointHitRadius: 10,
        tension: 0.2,
      },
    ],
  };

  const lineOptions: ChartOptions<"line"> = {
    datasets: {
      line: {},
    },
  };

  const barChartData: ChartData<"bar", number[]> = {
    labels: labels,
    datasets: [
      {
        label: "Per Trade PnL",
        data: sums,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,1)",
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    datasets: {
      bar: {
        borderRadius: 5,
      },
    },
  };

  return (
    <div>
      <Line data={lineChartData} options={lineOptions} />
      <Bar data={barChartData} options={options} />
    </div>
  );
};

export default PnLChartComponent;
