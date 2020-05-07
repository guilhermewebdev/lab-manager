import React from 'react';

import Auth from './auth/index'

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

export default function(){

    return (
      <Router>
        <Switch>
          <Route path="/auth">
            <Auth />
          </Route>
          <Route path="/">
            Tela inicial
          </Route>
        </Switch>
      </Router>
    )
}