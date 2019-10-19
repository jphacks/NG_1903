import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";
import  Store  from './store'
import Top from "./pages/Top";
import Login from "./pages/Login"


const App: React.FC = () => {
  return (
    <Provider store={Store}>
      <BrowserRouter>
        <div>
          <Route exact path="/" component={Top} />
          <Route path="/login" component={Login} />
        </div>
      </BrowserRouter>
    </Provider>
  );
};


export default App;
