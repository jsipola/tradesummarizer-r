import React from "react";
import logo from "./logo.svg";
import "./App.css";
import FetchData from "./fetchData";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <FetchData />
      </header>
    </div>
  );
}

export default App;
