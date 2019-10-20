import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";
import  Store  from './store'
import Top from "./pages/Top";
import Login from "./pages/Login"
import 'bootstrap/dist/css/bootstrap.min.css';
import UserDetail from "./pages/UserDetail";
import TeamDetail  from './pages/TeamDetailPage';
import Ranking from './pages/Ranking'

//export const URL = 'http://localhost:5000'
export const URL =　'https://mock.onsd.now.sh'

const App: React.FC = () => {
  return (
    <Provider store={Store}>
      <BrowserRouter>
          <Route exact path="/" component={Top} />
          <Route path="/login" component={Login} />
          <Route path="/userDetail" component={UserDetail}/>
          <Route path="/teamDetail" component={TeamDetail} />
          <Route path="/ranking" component={Ranking} />
      </BrowserRouter>
    </Provider>
  );
};


export default App;
