import React from "react";
import { v4 as uuidv4 } from "uuid";

import "./Trades.css";

export interface ApiTrades {
  Ticker: string;
  Transactions: Array<Transaction>;
}

export interface Trades {
  Ticker: string;
  SharesToCount: number;
  SharesToCountForBuying: number;
  Transactions: Array<Transaction>;
  Buy: Array<Transaction>;
  Sell: Array<Transaction>;
}

export interface Transaction {
  Amount: number;
  Date: Date;
  Isin: string;
  Shares: number;
  Ticker: string;
  Type: string;
}

function getSum(
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

export const ApiTradesItem: React.FC<ApiTrades> = (item) => {
  let totals: [number, number, number] = [0, 0, item.Transactions.length];
  item.Transactions?.forEach((a) => (totals = getSum(a, totals)));
  //console.log(totals);
  return (
    <div>
      <h1>{item.Ticker}</h1>
      {item.Transactions && (
        <>
          {item.Transactions.map((transaction) => (
            <TransactionItem key={uuidv4()} transaction={transaction} />
          ))}
          <p>Total: {totals[0].toFixed(2)} €</p>
        </>
      )}
    </div>
  );
};

export const TradesItem: React.FC<Trades> = (item) => {
  let reversedTransactions;
  // Create a shallow copy and reverse the list
  // since the returned transactions are in descending order
  if (item.Transactions) {
    reversedTransactions = item.Transactions.slice().reverse();
  }

  let totals: [number, number, number] = [0, 0, item.Transactions.length];
  reversedTransactions?.forEach((a) => (totals = getSum(a, totals)));
  console.log(totals);

  /*   reversedTransactions = reversedTransactions?.splice(
    0,
    reversedTransactions.length - totals[2]
  ); */

  return (
    <div>
      <h1>{item.Ticker}</h1>
      {reversedTransactions && (
        <>
          {reversedTransactions.map((transaction) => (
            <TransactionItem key={uuidv4()} transaction={transaction} />
          ))}
          <p>Total: {totals[0].toFixed(2)} €</p>
        </>
      )}
    </div>
  );
};

interface TransactionItemProps {
  transaction: Transaction;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
}) => {
  return (
    <div className="grid-container">
      <p>{transaction.Type}</p>
      <p>{transaction.Date.toString()}</p>
      <p>{transaction.Shares}</p>
      <p>{transaction.Amount.toFixed(2)} €</p>
    </div>
  );
};
