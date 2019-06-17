import React from 'react';
import {HashRouter,Redirect,Route,Switch} from 'react-router-dom'
import { Button } from 'antd'
import './app.less'
import Login from './Page/Login/Login';
import Admin from './Page/Admin/Admin';

function App() {
  return (
    <HashRouter>
      <Switch>
        <Route path='/login' component={Login}></Route>
        <Route path='/'  component={Admin}></Route>

      </Switch>
    </HashRouter>
  );
}

export default App;
