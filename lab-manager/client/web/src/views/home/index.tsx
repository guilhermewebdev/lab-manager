import React from 'react';

import Auth from './auth/index'

import {
  Switch,
  Route,
} from "react-router-dom";

export default function(){

    return (
        <Switch>
          <Route path="/auth">
            <Auth />
          </Route>
          <Route path="/">
            Tela inicial
          </Route>
        </Switch>
    )
}