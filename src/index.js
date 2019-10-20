import React from "react";
import ReactDOM from "react-dom";
import { Circle } from "./Circle";
import "./styles.css";

function App() {
  return (
    <div className="App">
      <Circle
        name={["koki", "koki", "koki", "koki", "target"]}
        data={[300, 330, 1100, 0, 2000]}
      />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
