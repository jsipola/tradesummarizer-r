import React, { useState, useEffect } from "react";
import axios from "axios";
import TickerTrades from "./TickerTrades";
import PnLChartComponent from "./chartTab/pnlchart";

import "./main.css";
import { ApiTrades } from "./helpers/TransactionHelpers";

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [data, setData] = useState<ApiTrades[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/validTrades"
        );
        setData(Object.values(response.data));
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
    return <div>Error loading data</div>;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "all":
        return <TickerTrades tradeData={data} />;
      case "graph":
        return <PnLChartComponent data={data} />;
      default:
        return <>Empty, should not be shown</>;
    }
  };

  return (
    <div className="main-content">
      <div className="tabs">
        <button onClick={() => setActiveTab("all")}>All</button>
        <button onClick={() => setActiveTab("graph")}>Graph</button>
      </div>
      {renderTabContent()}
    </div>
  );
};

export default MainContent;
