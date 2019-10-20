import React from "react";
import ReactDOM from "react-dom";
import { Gage } from "./Gage";

import "./styles.css";

function App() {
  return (
    <div className="App">
      <Gage
        name={["koki", "ikok", "kiko", "okik"]}
        data={[[130, 200], [130, 100], [20, 25], [200, 190]]}
      />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
