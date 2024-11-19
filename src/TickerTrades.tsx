import React from "react";
import { TradesTable } from "./TradesTable";
import { ApiTrades } from "./helpers/TransactionHelpers";

interface FetchDataProps {
  tradeData: ApiTrades[] | null;
}

const TickerTrades: React.FC<FetchDataProps> = ({ tradeData }) => {
  return (
    <div className="table-grid-container">
      {tradeData &&
        tradeData.map((item) => (
          <>
            <TradesTable
              Ticker={item.Ticker}
              Transactions={item.Transactions}
            />
          </>
        ))}
    </div>
  );
};

export default TickerTrades;
