import React from 'react';

import Home from './home';

import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import {
    BrowserRouter as Router,
    Switch,
    Route,
 } from "react-router-dom";

export default function Content() {
    const { data } = useQuery(gql`
        {
            isAuthenticated @client
        }
    `);

    if (data?.isAuthenticated === true) {

        return (
            <Router>
                <Switch>
                    <Route path="/">
                        <div>Você está logado</div>
                    </Route>
                </Switch>
            </Router>
        )
    } else {
            return (
                <Router>
                    <Switch>
                        <Route path="/">
                            <Home />
                        </Route>
                    </Switch>
                </Router>
            )
    }
}