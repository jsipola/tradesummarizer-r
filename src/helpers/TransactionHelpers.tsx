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

export function getSumFromTransaction(
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
