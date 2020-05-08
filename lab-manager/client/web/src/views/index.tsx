import React from 'react';

import Home from './home';

import { Redirect, Switch, Route } from 'react-router-dom'

import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

export default function Content() {
    const { data } = useQuery(gql`
        {
            isAuthenticated @client
        }
    `);

    if (data?.isAuthenticated === true) {

        return (
            <Switch>
                <Route path="/auth">
                    <Redirect to="/" />
                </Route>
                <Route path="/">
                    <div>você está logado</div>
                </Route>
            </Switch>
        )
    } else {
        return (
            <Home />
        )
    }
}