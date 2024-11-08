import React from "react";
import { ApiTrades, TradesTable } from "./Trades";

interface FetchDataProps {
  tradeData: ApiTrades[] | null;
}

const ShowData: React.FC<FetchDataProps> = ({ tradeData }) => {
  return (
    <div className="aligner">
      {tradeData &&
        tradeData.map((item) => (
          <>
            <div>
              <TradesTable
                Ticker={item.Ticker}
                Transactions={item.Transactions}
              />
            </div>
          </>
        ))}
    </div>
  );
};

export default ShowData;
