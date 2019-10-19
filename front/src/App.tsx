import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Top from "./pages/Top";
import "./App.css";
import { Provider } from "react-redux";
import  Store  from './store'

const App: React.FC = () => {
  return (
    <Provider store={Store}>
      <BrowserRouter>
        <div>
          <Route exact path="/" component={Top} />
        </div>
      </BrowserRouter>
    </Provider>
  );
};


export default App;
