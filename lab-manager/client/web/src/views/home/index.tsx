import React from 'react';

import Auth from './auth/index'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";

export default function(){

    return (
      <Router>
        <Switch>
          <Route path="/auth">
            <Auth />
          </Route>
        </Switch>
      </Router>
    )
}