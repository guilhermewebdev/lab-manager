import React from 'react';

import Auth from './auth/index'


import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import {
  Switch,
  Route,
} from "react-router-dom";


export default function () {

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