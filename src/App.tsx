import logo from "./logo.svg";
import "./App.css";
import MainContent from "./main";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <MainContent />
    </div>
  );
}

export default App;
