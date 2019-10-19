import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Index from "./pages/index";
import "./App.css";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div>
        <Route exact path="/" component={Index} />
      </div>
    </BrowserRouter>
  );
};


export default App;
