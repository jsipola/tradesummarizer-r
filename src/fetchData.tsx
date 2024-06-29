import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ApiTrades,
  ApiTradesItem,
  Trades,
  TradesItem,
  Transaction,
} from "./Trades";

const FetchData: React.FC = () => {
  const [data, setData] = useState<ApiTrades[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/validTrades"
        );
        //setData(response.data);
        setData(Object.values(response.data));
        console.log(response.data);
        console.log(Object.values(response.data));
        setLoading(false);
      } catch (err) {
        setError("Error fetching data " + err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  // data?.map((a) => console.log(a));
  console.log(data);
  console.log(data?.length);
  return (
    <div>
      {data &&
        data.map((item) => (
          <ApiTradesItem
            key={item.Ticker}
            Ticker={item.Ticker}
            Transactions={
              item.Transactions
            } /*             SharesToCount={item.SharesToCount}
            SharesToCountForBuying={item.SharesToCountForBuying}
            Transactions={item.Transactions}
            Buy={item.Buy}
            Sell={item.Sell} */
          />
        ))}
    </div>
  );
};

export default FetchData;
