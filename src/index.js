import React from "react";
import ReactDOM from "react-dom";
import { Circle } from "./Circle";
import "./styles.css";

function App() {
  return (
    <div className="App">
      <Circle data={[100, 300, 500, 1100, 2000]} />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
