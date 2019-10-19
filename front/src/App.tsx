import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";
import  Store  from './store'
import Top from "./pages/Top";
import Login from "./pages/Login"
import 'bootstrap/dist/css/bootstrap.min.css';
import UserDetail from "./pages/UserDetail";
import TeamDetail  from './pages/TeamDetailPage';

export const URL = 'http://localhost:5000'

const App: React.FC = () => {
  return (
    <Provider store={Store}>
      <BrowserRouter>
          <Route exact path="/" component={Top} />
          <Route path="/login" component={Login} />
          <Route path="/userDetail" component={UserDetail}/>
          <Route path="/teamDetail" component={TeamDetail} />
      </BrowserRouter>
    </Provider>
  );
};


export default App;
