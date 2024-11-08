import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import "./Trades.css";

export interface ApiTrades {
  Ticker: string;
  Transactions: Array<Transaction>;
}

export interface Transaction {
  Amount: number;
  Date: string;
  Isin: string;
  Shares: number;
  Ticker: string;
  Type: string;
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

export const TradesTable: React.FC<ApiTrades> = (item) => {
  const [isVisible, setIsVisible] = useState(false);

  let totals: [number, number, number] = [0, 0, item.Transactions.length];
  item.Transactions?.forEach(
    (a) => (totals = getSumFromTransaction(a, totals))
  );

  const toggleTrades = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div>
      <h2>{item.Ticker}</h2>
      <table className="tableContainer">
        <thead>
          <tr>
            <th>Type</th>
            <th>Date</th>
            <th>Share #</th>
            <th>Sum</th>
          </tr>
        </thead>
        <tbody>
          <>
            {isVisible ? (
              <>
                {item.Transactions.map((transaction) => (
                  <tr
                    key={uuidv4()}
                    className="expandrow"
                    onClick={toggleTrades}
                  >
                    <td>{transaction.Type}</td>
                    <td>{transaction.Date.toString()}</td>
                    <td>{transaction.Shares}</td>
                    <td>
                      {transaction.Type === "Osto" ? "-" : ""}
                      {transaction.Amount.toFixed(2)} €
                    </td>
                  </tr>
                ))}
              </>
            ) : (
              <tr key={uuidv4()} onClick={toggleTrades} className="expandrow">
                <td colSpan={4}>Expand</td>
              </tr>
            )}
          </>
        </tbody>
        <tfoot>
          <tr key={uuidv4()} className="totalRow">
            <td>Total</td>
            <td></td>
            <td></td>
            <td>{totals[0].toFixed(2)} €</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
