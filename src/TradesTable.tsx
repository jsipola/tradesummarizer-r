import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import "./TradesTable.css";
import { ApiTrades, getSumFromTransaction } from "./helpers/TransactionHelpers";

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
    <div className="align-items">
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
